import { Card } from '../domain/model'
import { CardRepository } from '../domain/repository'

/**
 * BulkOperationsService (Phase 5)
 * Provides batch operations on cards for efficiency
 */
export class BulkOperationsService {
  constructor(private cardRepository: CardRepository) {}

  /**
   * Delete multiple cards at once
   */
  async deleteCards(cardIds: string[]): Promise<void> {
    for (const id of cardIds) {
      await this.cardRepository.deleteCard(id)
    }
  }

  /**
   * Move multiple cards to a different deck
   */
  async moveCardsToDeck(cardIds: string[], targetDeckId: string): Promise<void> {
    for (const id of cardIds) {
      const card = await this.cardRepository.getCard(id)
      if (card) {
        await this.cardRepository.saveCard({
          ...card,
          deckId: targetDeckId,
          modified: new Date(),
        })
      }
    }
  }

  /**
   * Reset progress for multiple cards (set back to New state)
   */
  async resetCards(cardIds: string[]): Promise<void> {
    const now = new Date()
    for (const id of cardIds) {
      const card = await this.cardRepository.getCard(id)
      if (card) {
        await this.cardRepository.saveCard({
          ...card,
          state: 0, // CardState.New
          reps: 0,
          lapses: 0,
          due: now,
          last_review: undefined,
          modified: now,
        })
      }
    }
  }

  /**
   * Duplicate multiple cards
   */
  async duplicateCards(cardIds: string[]): Promise<Card[]> {
    const duplicatedCards: Card[] = []
    const now = new Date()

    for (const id of cardIds) {
      const card = await this.cardRepository.getCard(id)
      if (card) {
        const newCard: Card = {
          ...card,
          id: this.generateId(),
          created: now,
          modified: now,
          state: 0, // CardState.New - reset state for duplicates
          reps: 0,
          lapses: 0,
          due: now,
          last_review: undefined,
        }
        await this.cardRepository.saveCard(newCard)
        duplicatedCards.push(newCard)
      }
    }

    return duplicatedCards
  }

  /**
   * Generate a unique ID for a card
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
