import { Card, Deck, CardState } from '../domain/model'

/**
 * Phase6 card data structure
 * Phase6 exports cards as XML or CSV
 */
interface Phase6Card {
  front: string
  back: string
  phase: number // 1-6, representing learning phase
  lastStudied?: Date
}

/**
 * Phase6 vocabulary entry from XML export
 */
interface Phase6VocabEntry {
  question: string
  answer: string
  phase: number
  date?: string
}

/**
 * Result of an import operation
 */
export interface Phase6ImportResult {
  success: boolean
  decks: Deck[]
  cards: Card[]
  errors: string[]
  warnings: string[]
}

/**
 * Phase6ImportService
 * Handles import of Phase6 vocabulary data
 * Phase6 is a popular vocabulary learning app that uses 6-phase learning system
 */
export class Phase6ImportService {
  /**
   * Import cards from Phase6 XML export
   * @param xmlContent - XML string containing Phase6 export data
   * @param deckName - Name for the imported deck
   */
  static importFromXml(xmlContent: string, deckName: string = 'Phase6 Import'): Phase6ImportResult {
    const result: Phase6ImportResult = {
      success: false,
      decks: [],
      cards: [],
      errors: [],
      warnings: [],
    }

    try {
      const entries = this.parsePhase6Xml(xmlContent)
      
      if (entries.length === 0) {
        result.errors.push('No vocabulary entries found in XML file')
        return result
      }

      const now = new Date()

      // Create deck
      const deck: Deck = {
        id: this.generateId(),
        name: deckName,
        description: `Imported from Phase6 (${entries.length} cards)`,
        created: now,
        modified: now,
      }
      result.decks.push(deck)

      // Convert Phase6 entries to cards
      for (const entry of entries) {
        try {
          const card = this.convertPhase6ToCard(entry, deck.id)
          result.cards.push(card)
        } catch (error) {
          result.warnings.push(`Failed to convert entry "${entry.question.substring(0, 20)}...": ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      result.success = result.cards.length > 0
    } catch (error) {
      result.errors.push(`Failed to parse Phase6 XML: ${error instanceof Error ? error.message : String(error)}`)
    }

    return result
  }

  /**
   * Import cards from Phase6 CSV export
   * Format: question,answer,phase (or variations)
   * @param csvContent - CSV string containing Phase6 export data
   * @param deckName - Name for the imported deck
   */
  static importFromCsv(csvContent: string, deckName: string = 'Phase6 Import'): Phase6ImportResult {
    const result: Phase6ImportResult = {
      success: false,
      decks: [],
      cards: [],
      errors: [],
      warnings: [],
    }

    try {
      const lines = csvContent.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        result.errors.push('CSV file must contain at least a header and one entry')
        return result
      }

      const now = new Date()

      // Create deck
      const deck: Deck = {
        id: this.generateId(),
        name: deckName,
        description: `Imported from Phase6`,
        created: now,
        modified: now,
      }
      result.decks.push(deck)

      // Parse header to determine column positions
      const header = lines[0].toLowerCase()
      const columns = this.parseHeader(header)

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        try {
          const fields = this.parseCSVLine(line)
          const entry: Phase6VocabEntry = {
            question: fields[columns.question] || '',
            answer: fields[columns.answer] || '',
            phase: parseInt(fields[columns.phase] || '1', 10) || 1,
            date: fields[columns.date],
          }

          if (!entry.question || !entry.answer) {
            result.warnings.push(`Skipping row ${i + 1}: missing question or answer`)
            continue
          }

          const card = this.convertPhase6ToCard(entry, deck.id)
          result.cards.push(card)
        } catch (error) {
          result.warnings.push(`Error parsing row ${i + 1}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      result.success = result.cards.length > 0
    } catch (error) {
      result.errors.push(`Failed to parse Phase6 CSV: ${error instanceof Error ? error.message : String(error)}`)
    }

    return result
  }

  /**
   * Parse Phase6 XML export format
   */
  private static parsePhase6Xml(xmlContent: string): Phase6VocabEntry[] {
    const entries: Phase6VocabEntry[] = []

    // Phase6 XML typically has structure like:
    // <vocabulary>
    //   <entry>
    //     <question>...</question>
    //     <answer>...</answer>
    //     <phase>...</phase>
    //   </entry>
    // </vocabulary>

    // Simple regex-based parsing (for cross-platform compatibility)
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi
    const questionRegex = /<question[^>]*>([\s\S]*?)<\/question>/i
    const answerRegex = /<answer[^>]*>([\s\S]*?)<\/answer>/i
    const phaseRegex = /<phase[^>]*>([\s\S]*?)<\/phase>/i
    const dateRegex = /<(?:date|lastStudied)[^>]*>([\s\S]*?)<\/(?:date|lastStudied)>/i

    // Also support alternative tag names
    const frontRegex = /<(?:front|word|term|source)[^>]*>([\s\S]*?)<\/(?:front|word|term|source)>/i
    const backRegex = /<(?:back|translation|definition|target)[^>]*>([\s\S]*?)<\/(?:back|translation|definition|target)>/i
    const levelRegex = /<(?:level|box|stage)[^>]*>([\s\S]*?)<\/(?:level|box|stage)>/i

    let match
    while ((match = entryRegex.exec(xmlContent)) !== null) {
      const entryXml = match[1]

      const questionMatch = questionRegex.exec(entryXml) || frontRegex.exec(entryXml)
      const answerMatch = answerRegex.exec(entryXml) || backRegex.exec(entryXml)
      const phaseMatch = phaseRegex.exec(entryXml) || levelRegex.exec(entryXml)
      const dateMatch = dateRegex.exec(entryXml)

      if (questionMatch && answerMatch) {
        entries.push({
          question: this.decodeXmlEntities(questionMatch[1].trim()),
          answer: this.decodeXmlEntities(answerMatch[1].trim()),
          phase: phaseMatch ? parseInt(phaseMatch[1].trim(), 10) || 1 : 1,
          date: dateMatch ? dateMatch[1].trim() : undefined,
        })
      }
    }

    // Also try card-based format
    if (entries.length === 0) {
      const cardRegex = /<card[^>]*>([\s\S]*?)<\/card>/gi
      while ((match = cardRegex.exec(xmlContent)) !== null) {
        const cardXml = match[1]

        const questionMatch = questionRegex.exec(cardXml) || frontRegex.exec(cardXml)
        const answerMatch = answerRegex.exec(cardXml) || backRegex.exec(cardXml)
        const phaseMatch = phaseRegex.exec(cardXml) || levelRegex.exec(cardXml)

        if (questionMatch && answerMatch) {
          entries.push({
            question: this.decodeXmlEntities(questionMatch[1].trim()),
            answer: this.decodeXmlEntities(answerMatch[1].trim()),
            phase: phaseMatch ? parseInt(phaseMatch[1].trim(), 10) || 1 : 1,
          })
        }
      }
    }

    return entries
  }

  /**
   * Parse CSV header to determine column positions
   */
  private static parseHeader(header: string): { question: number; answer: number; phase: number; date: number } {
    const fields = this.parseCSVLine(header.toLowerCase())
    
    const result = {
      question: 0,
      answer: 1,
      phase: 2,
      date: -1,
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i].trim()
      if (field.includes('question') || field.includes('front') || field.includes('word') || field.includes('term') || field.includes('source')) {
        result.question = i
      } else if (field.includes('answer') || field.includes('back') || field.includes('translation') || field.includes('definition') || field.includes('target')) {
        result.answer = i
      } else if (field.includes('phase') || field.includes('level') || field.includes('box') || field.includes('stage')) {
        result.phase = i
      } else if (field.includes('date') || field.includes('studied')) {
        result.date = i
      }
    }

    return result
  }

  /**
   * Convert Phase6 entry to Card
   * Maps Phase6's 6-phase system to FSRS state and parameters
   */
  private static convertPhase6ToCard(entry: Phase6VocabEntry, deckId: string): Card {
    const now = new Date()

    // Map Phase6 phase (1-6) to FSRS state and parameters
    // Phase 1-2: New/Learning
    // Phase 3-4: Review
    // Phase 5-6: Well-learned
    const { state, stability, difficulty, scheduledDays } = this.mapPhase6ToFSRS(entry.phase)

    // Calculate due date based on phase
    const due = new Date()
    due.setDate(due.getDate() + scheduledDays)

    const card: Card = {
      id: this.generateId(),
      deckId,
      front: entry.question,
      back: entry.answer,
      created: now,
      modified: now,
      due,
      stability,
      difficulty,
      elapsed_days: 0,
      scheduled_days: scheduledDays,
      reps: Math.max(0, entry.phase - 1), // Approximate reps from phase
      lapses: 0,
      state,
      last_review: entry.date ? new Date(entry.date) : undefined,
    }

    return card
  }

  /**
   * Map Phase6 phase number to FSRS parameters
   * Phase6 uses 6 boxes:
   * 1: Daily review
   * 2: Every 2 days
   * 3: Every 4 days  
   * 4: Every week
   * 5: Every 2 weeks
   * 6: Monthly (mastered)
   */
  private static mapPhase6ToFSRS(phase: number): {
    state: CardState
    stability: number
    difficulty: number
    scheduledDays: number
  } {
    // Clamp phase to valid range
    const clampedPhase = Math.max(1, Math.min(6, phase))

    // Phase to interval mapping (days)
    const intervals = [1, 2, 4, 7, 14, 30]
    const scheduledDays = intervals[clampedPhase - 1]

    // Map to card state
    let state: CardState
    if (clampedPhase <= 2) {
      state = CardState.Learning
    } else if (clampedPhase <= 5) {
      state = CardState.Review
    } else {
      state = CardState.Review // Phase 6 is well-learned, still review state
    }

    // Stability increases with phase (rough approximation)
    const stability = clampedPhase * 5 // 5, 10, 15, 20, 25, 30

    // Difficulty decreases with higher phase (card is getting easier)
    const difficulty = Math.max(1, 7 - clampedPhase) // 6, 5, 4, 3, 2, 1

    return { state, stability, difficulty, scheduledDays }
  }

  /**
   * Decode XML entities
   * Note: &amp; must be replaced last to avoid double-decoding
   */
  private static decodeXmlEntities(text: string): string {
    return text
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&') // Must be last to avoid double-decoding
  }

  /**
   * Parse a CSV line handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if ((char === ',' || char === ';' || char === '\t') && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Validate import file format
   */
  static validateImportFormat(content: string, format: 'xml' | 'csv'): { valid: boolean; error?: string } {
    try {
      if (format === 'xml') {
        // Check for basic XML structure
        if (!content.includes('<') || !content.includes('>')) {
          return { valid: false, error: 'Invalid XML: not a valid XML file' }
        }
        // Try to find vocabulary entries
        const hasEntries = /<(entry|card|vocabulary)/i.test(content)
        if (!hasEntries) {
          return { valid: false, error: 'No vocabulary entries found in XML' }
        }
      } else if (format === 'csv') {
        const lines = content.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          return { valid: false, error: 'CSV file must contain at least a header and one entry' }
        }
      }
      
      return { valid: true }
    } catch (error) {
      return { 
        valid: false, 
        error: `Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }
}
