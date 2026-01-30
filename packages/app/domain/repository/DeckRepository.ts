import { Deck } from '../model'

/**
 * DeckRepository Interface
 * Defines operations for deck data management
 */
export interface DeckRepository {
  /**
   * Get a single deck by ID
   */
  getDeck(id: string): Promise<Deck | null>

  /**
   * Get all decks for the current user
   */
  getAllDecks(): Promise<Deck[]>

  /**
   * Save or update a deck
   */
  saveDeck(deck: Deck): Promise<void>

  /**
   * Delete a deck and all its cards
   */
  deleteDeck(id: string): Promise<void>
}
