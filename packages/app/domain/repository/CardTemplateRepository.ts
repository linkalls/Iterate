import { CardTemplate } from '../model'

/**
 * CardTemplateRepository Interface (Phase 5)
 * Defines operations for card template data management
 */
export interface CardTemplateRepository {
  /**
   * Get a single template by ID
   */
  getTemplate(id: string): Promise<CardTemplate | null>

  /**
   * Get all templates for the current user
   */
  getAllTemplates(): Promise<CardTemplate[]>

  /**
   * Get templates for a specific deck
   */
  getTemplatesByDeck(deckId: string): Promise<CardTemplate[]>

  /**
   * Save or update a template
   */
  saveTemplate(template: CardTemplate): Promise<void>

  /**
   * Delete a template
   */
  deleteTemplate(id: string): Promise<void>
}
