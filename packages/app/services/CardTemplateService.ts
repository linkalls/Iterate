import { Card, CardTemplate, CardState } from '../domain/model'

/**
 * CardTemplateService (Phase 5)
 * Handles card template creation and card generation from templates
 */
export class CardTemplateService {
  /**
   * Create cards from a template with field values
   * @param template The card template
   * @param fieldValues Array of field value mappings
   * @param deckId Target deck for the cards
   */
  static createCardsFromTemplate(
    template: CardTemplate,
    fieldValues: Record<string, string>[],
    deckId: string
  ): Card[] {
    const now = new Date()
    const cards: Card[] = []

    for (const values of fieldValues) {
      const front = this.replaceTemplateFields(template.frontTemplate, values)
      const back = this.replaceTemplateFields(template.backTemplate, values)

      const card: Card = {
        id: this.generateId(),
        deckId,
        front,
        back,
        created: now,
        modified: now,
        templateId: template.id,
        
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

    return cards
  }

  /**
   * Replace template field placeholders with values
   * Example: "{{word}}" -> "apple"
   */
  private static replaceTemplateFields(
    template: string,
    values: Record<string, string>
  ): string {
    let result = template

    for (const [field, value] of Object.entries(values)) {
      const placeholder = `{{${field}}}`
      result = result.replace(new RegExp(placeholder, 'g'), value)
    }

    return result
  }

  /**
   * Validate that all required fields are present
   */
  static validateFieldValues(
    template: CardTemplate,
    values: Record<string, string>
  ): { valid: boolean; missingFields: string[] } {
    const missingFields: string[] = []

    for (const field of template.fields) {
      if (!values[field] || values[field].trim() === '') {
        missingFields.push(field)
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields,
    }
  }

  /**
   * Extract field names from a template string
   * Example: "The word is {{word}}" -> ["word"]
   */
  static extractFields(template: string): string[] {
    const fieldRegex = /\{\{(\w+)\}\}/g
    const fields = new Set<string>()
    let match

    while ((match = fieldRegex.exec(template)) !== null) {
      fields.add(match[1])
    }

    return Array.from(fields)
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
