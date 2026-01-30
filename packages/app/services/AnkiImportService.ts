import * as JSZip from 'jszip'
import { Card, Deck, CardState } from '../domain/model'
import { SQLiteDatabase, SQLiteAdapter, createSQLiteAdapter } from './sqlite-adapter'

/**
 * Represents the structure of an Anki note
 */
interface AnkiNote {
  id: number
  mid: number // model id
  flds: string // fields separated by \x1f
  tags: string
}

/**
 * Represents the structure of an Anki card
 */
interface AnkiCard {
  id: number
  nid: number // note id
  did: number // deck id
  ivl: number // interval
  factor: number // ease factor
  reps: number
  lapses: number
  due: number
  type: number // 0=new, 1=learning, 2=review, 3=relearning
}

/**
 * Represents the structure of an Anki deck
 */
interface AnkiDeck {
  id: number
  name: string
}

/**
 * Result of an import operation
 */
export interface AnkiImportResult {
  success: boolean
  decks: Deck[]
  cards: Card[]
  errors: string[]
  warnings: string[]
}

/**
 * AnkiImportService
 * Handles import of Anki .apkg files
 */
export class AnkiImportService {
  private static adapter: SQLiteAdapter | null = null

  /**
   * Initialize SQLite adapter (sql.js or bun:sqlite based on runtime)
   */
  private static async initAdapter(): Promise<SQLiteAdapter> {
    if (!this.adapter) {
      this.adapter = await createSQLiteAdapter()
    }
    return this.adapter
  }

  /**
   * Import cards from an Anki .apkg file
   * @param apkgData - ArrayBuffer containing the .apkg file data
   * @param userId - User ID to assign to imported cards
   */
  static async importFromApkg(apkgData: ArrayBuffer, userId?: string): Promise<AnkiImportResult> {
    const result: AnkiImportResult = {
      success: false,
      decks: [],
      cards: [],
      errors: [],
      warnings: [],
    }

    try {
      // Load JSZip and extract the collection.anki2 file
      const zip = await JSZip.loadAsync(apkgData)
      
      // Anki packages contain collection.anki2 (SQLite database) or collection.anki21
      const dbFile = zip.file('collection.anki2') || zip.file('collection.anki21')
      
      if (!dbFile) {
        result.errors.push('Invalid .apkg file: collection database not found')
        return result
      }

      const dbData = await dbFile.async('arraybuffer')
      
      // Initialize SQLite adapter and open database
      const adapter = await this.initAdapter()
      if (!adapter) {
        result.errors.push('Failed to initialize SQLite adapter')
        return result
      }
      
      const db = adapter.openDatabase(new Uint8Array(dbData))

      try {
        // Extract decks from col table
        const decksResult = await this.extractDecks(db)
        result.decks = decksResult.decks
        result.warnings.push(...decksResult.warnings)

        // Extract notes and cards
        const cardsResult = await this.extractCards(db, decksResult.deckMap)
        result.cards = cardsResult.cards
        result.warnings.push(...cardsResult.warnings)

        result.success = true
      } finally {
        db.close()
      }

      // Extract media files (optional, store URLs/paths for later use)
      const mediaFile = zip.file('media')
      if (mediaFile) {
        result.warnings.push('Media files found but not imported (media import not yet supported)')
      }

    } catch (error) {
      result.errors.push(`Failed to import .apkg file: ${error instanceof Error ? error.message : String(error)}`)
    }

    return result
  }

  /**
   * Extract deck information from the Anki database
   */
  private static async extractDecks(db: SQLiteDatabase): Promise<{
    decks: Deck[]
    deckMap: Map<number, string>
    warnings: string[]
  }> {
    const decks: Deck[] = []
    const deckMap = new Map<number, string>() // Anki deck ID -> our deck ID
    const warnings: string[] = []
    const now = new Date()

    try {
      // In Anki, decks are stored as JSON in the 'col' table's 'decks' column
      const stmt = db.prepare('SELECT decks FROM col')
      
      if (stmt.step()) {
        const row = stmt.getAsObject()
        const decksJson = JSON.parse(row.decks as string) as Record<string, { id: number; name: string }>
        
        for (const [deckId, deckData] of Object.entries(decksJson)) {
          // Skip the default deck if it's empty
          if (deckData.name === 'Default' && deckId === '1') {
            deckMap.set(Number(deckId), this.generateId())
            continue
          }

          const deck: Deck = {
            id: this.generateId(),
            name: deckData.name,
            description: `Imported from Anki`,
            created: now,
            modified: now,
          }
          
          decks.push(deck)
          deckMap.set(Number(deckId), deck.id)
        }
      }
      
      stmt.free()
    } catch (error) {
      warnings.push(`Error extracting decks: ${error instanceof Error ? error.message : String(error)}`)
    }

    // If no decks were found, create a default one
    if (decks.length === 0) {
      const defaultDeck: Deck = {
        id: this.generateId(),
        name: 'Imported from Anki',
        description: 'Cards imported from Anki',
        created: now,
        modified: now,
      }
      decks.push(defaultDeck)
      deckMap.set(1, defaultDeck.id)
    }

    return { decks, deckMap, warnings }
  }

  /**
   * Extract cards from the Anki database
   */
  private static async extractCards(
    db: SQLiteDatabase,
    deckMap: Map<number, string>
  ): Promise<{ cards: Card[]; warnings: string[] }> {
    const cards: Card[] = []
    const warnings: string[] = []
    const now = new Date()

    try {
      // Query notes and cards
      const stmt = db.prepare(`
        SELECT 
          n.id as nid,
          n.flds as flds,
          n.tags as tags,
          c.id as cid,
          c.did as did,
          c.ivl as ivl,
          c.factor as factor,
          c.reps as reps,
          c.lapses as lapses,
          c.due as due,
          c.type as type
        FROM notes n
        JOIN cards c ON c.nid = n.id
      `)

      while (stmt.step()) {
        const row = stmt.getAsObject() as {
          nid: number
          flds: string
          tags: string
          cid: number
          did: number
          ivl: number
          factor: number
          reps: number
          lapses: number
          due: number
          type: number
        }

        try {
          // Parse fields (separated by \x1f in Anki)
          const fields = (row.flds || '').split('\x1f')
          const front = fields[0] || ''
          const back = fields[1] || ''

          if (!front) {
            warnings.push(`Skipping card ${row.cid}: empty front field`)
            continue
          }

          // Map Anki deck ID to our deck ID
          let deckId = deckMap.get(row.did)
          if (!deckId) {
            // Use first deck as fallback
            deckId = deckMap.values().next().value
          }

          // Convert Anki state to our CardState
          const state = this.mapAnkiState(row.type)

          // Calculate FSRS-compatible values from Anki's scheduling data
          const stability = Math.max(1, row.ivl) // Use interval as rough stability estimate
          const difficulty = Math.max(1, Math.min(10, (300 - row.factor) / 25)) // Convert ease factor (130-300) to difficulty (1-10)

          const card: Card = {
            id: this.generateId(),
            deckId: deckId!,
            front: this.cleanHtml(front),
            back: this.cleanHtml(back),
            created: now,
            modified: now,
            due: this.calculateDueDate(row.due, row.type),
            stability,
            difficulty,
            elapsed_days: Math.max(0, row.ivl),
            scheduled_days: Math.max(0, row.ivl),
            reps: row.reps,
            lapses: row.lapses,
            state,
          }

          cards.push(card)
        } catch (cardError) {
          warnings.push(`Error processing card ${row.cid}: ${cardError instanceof Error ? cardError.message : String(cardError)}`)
        }
      }

      stmt.free()
    } catch (error) {
      warnings.push(`Error extracting cards: ${error instanceof Error ? error.message : String(error)}`)
    }

    return { cards, warnings }
  }

  /**
   * Map Anki card type to our CardState
   */
  private static mapAnkiState(ankiType: number): CardState {
    switch (ankiType) {
      case 0:
        return CardState.New
      case 1:
        return CardState.Learning
      case 2:
        return CardState.Review
      case 3:
        return CardState.Relearning
      default:
        return CardState.New
    }
  }

  /**
   * Calculate due date from Anki's due value
   * For review cards, due is days since epoch
   * For learning cards, due is timestamp
   */
  private static calculateDueDate(ankiDue: number, ankiType: number): Date {
    const now = new Date()

    if (ankiType === 0) {
      // New card - due now
      return now
    } else if (ankiType === 1) {
      // Learning card - due is timestamp in seconds
      return new Date(ankiDue * 1000)
    } else {
      // Review card - due is days since collection creation
      // Approximate by using days from now
      const daysFromNow = ankiDue - Math.floor(Date.now() / 86400000)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + daysFromNow)
      return dueDate
    }
  }

  /**
   * Clean HTML from Anki card content
   * Removes basic HTML tags while preserving content
   */
  private static cleanHtml(html: string): string {
    // First, decode HTML entities before sanitizing
    let decoded = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
    
    // Then sanitize HTML by removing tags in a loop to handle nested tags
    let previous = ''
    while (previous !== decoded) {
      previous = decoded
      decoded = decoded
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<div[^>]*>/gi, '\n')
        .replace(/<\/div>/gi, '')
        .replace(/<[^>]+>/g, '')
    }
    
    return decoded.trim()
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Validate if the provided data is a valid .apkg file
   */
  static async validateApkgFile(data: ArrayBuffer): Promise<{ valid: boolean; error?: string }> {
    try {
      const zip = await JSZip.loadAsync(data)
      const hasCollection = zip.file('collection.anki2') !== null || zip.file('collection.anki21') !== null
      
      if (!hasCollection) {
        return { valid: false, error: 'Invalid .apkg file: no collection database found' }
      }
      
      return { valid: true }
    } catch {
      return { valid: false, error: 'Invalid .apkg file: not a valid zip archive' }
    }
  }
}
