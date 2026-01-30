import { Card, Deck, CardState } from '../domain/model'

/**
 * ImportExportService (Phase 5)
 * Handles import/export of cards in various formats, including Anki
 */
export class ImportExportService {
  /**
   * Export cards to Anki-compatible CSV format
   * Format: front, back, tags (deck name)
   */
  static exportToAnkiCSV(cards: Card[], deck: Deck): string {
    const lines: string[] = []

    // Add header
    lines.push('front,back,tags')

    // Add each card
    for (const card of cards) {
      const front = this.escapeCSV(card.front)
      const back = this.escapeCSV(card.back)
      const tags = this.escapeCSV(deck.name)
      lines.push(`${front},${back},${tags}`)
    }

    return lines.join('\n')
  }

  /**
   * Import cards from Anki-compatible CSV format
   * Expected format: front, back, tags (optional)
   */
  static importFromAnkiCSV(csvContent: string, deckId: string): Card[] {
    const lines = csvContent.split('\n')
    const cards: Card[] = []
    const now = new Date()

    // Skip header if present
    const startIndex = lines[0]?.toLowerCase().includes('front') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const [front, back] = this.parseCSVLine(line)
      
      if (front && back) {
        const card: Card = {
          id: this.generateId(),
          deckId,
          front: front.trim(),
          back: back.trim(),
          created: now,
          modified: now,
          
          // Initialize FSRS fields
          due: now,
          stability: 0,
          difficulty: 0,
          elapsed_days: 0,
          scheduled_days: 0,
          reps: 0,
          lapses: 0,
          state: CardState.New,
        }
        
        cards.push(card)
      }
    }

    return cards
  }

  /**
   * Export cards to JSON format (full data preservation)
   */
  static exportToJSON(cards: Card[], deck: Deck): string {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      deck: {
        name: deck.name,
        description: deck.description,
      },
      cards: cards.map(card => ({
        ...card,
        created: card.created.toISOString(),
        modified: card.modified.toISOString(),
        due: card.due.toISOString(),
        last_review: card.last_review?.toISOString(),
      })),
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Import cards from JSON format
   */
  static importFromJSON(jsonContent: string, deckId: string): Card[] {
    try {
      const data = JSON.parse(jsonContent)
      const cards: Card[] = []

      if (!data.cards || !Array.isArray(data.cards)) {
        throw new Error('Invalid JSON format: missing cards array')
      }

      for (const cardData of data.cards) {
        const card: Card = {
          ...cardData,
          id: this.generateId(), // Generate new IDs to avoid conflicts
          deckId, // Use the target deck ID
          created: new Date(cardData.created),
          modified: new Date(cardData.modified),
          due: new Date(cardData.due),
          last_review: cardData.last_review ? new Date(cardData.last_review) : undefined,
        }
        
        cards.push(card)
      }

      return cards
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Escape special characters for CSV
   */
  private static escapeCSV(text: string): string {
    // If text contains comma, quote, or newline, wrap in quotes and escape quotes
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`
    }
    return text
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
          // Escaped quote
          current += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    // Add last field
    result.push(current)

    return result
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validate import file format
   */
  static validateImportFormat(content: string, format: 'csv' | 'json'): { valid: boolean; error?: string } {
    try {
      if (format === 'json') {
        const data = JSON.parse(content)
        if (!data.cards || !Array.isArray(data.cards)) {
          return { valid: false, error: 'Invalid JSON: missing cards array' }
        }
        if (data.cards.length === 0) {
          return { valid: false, error: 'No cards found in JSON file' }
        }
      } else if (format === 'csv') {
        const lines = content.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          return { valid: false, error: 'CSV file must contain at least a header and one card' }
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
