import { Card } from '../model'

/**
 * CardRepository Interface
 * Defines operations for card data management without specifying implementation
 */
export interface CardRepository {
  /**
   * Get a single card by ID
   */
  getCard(id: string): Promise<Card | null>

  /**
   * Get all cards for a specific deck
   */
  getCardsByDeck(deckId: string): Promise<Card[]>

  /**
   * Get cards that are due for review before or on the specified date
   */
  getDueCards(date: Date, deckId?: string): Promise<Card[]>

  /**
   * Save or update a card
   */
  saveCard(card: Card): Promise<void>

  /**
   * Delete a card
   */
  deleteCard(id: string): Promise<void>

  /**
   * Get total number of cards in a deck
   */
  getCardCount(deckId: string): Promise<number>
}
