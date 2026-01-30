import { Card, CardState } from '../../domain/model'
import { CardRepository } from '../../domain/repository'

/**
 * MockCardRepository
 * In-memory implementation for development and testing
 */
export class MockCardRepository implements CardRepository {
  private cards: Map<string, Card> = new Map()

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData()
  }

  private initializeSampleData() {
    const sampleCards: Card[] = [
      {
        id: '1',
        deckId: 'deck-1',
        front: 'What is FSRS?',
        back: 'Free Spaced Repetition Scheduler - An algorithm for optimizing spaced repetition learning',
        created: new Date('2024-01-01'),
        modified: new Date('2024-01-01'),
        due: new Date(),
        stability: 1,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: CardState.New,
      },
      {
        id: '2',
        deckId: 'deck-1',
        front: 'What does Iterate mean?',
        back: 'To repeat a process, especially to evolve and improve through repetition',
        created: new Date('2024-01-02'),
        modified: new Date('2024-01-02'),
        due: new Date(),
        stability: 1,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: CardState.New,
      },
    ]

    sampleCards.forEach((card) => this.cards.set(card.id, card))
  }

  async getCard(id: string): Promise<Card | null> {
    return this.cards.get(id) || null
  }

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    return Array.from(this.cards.values()).filter(
      (card) => card.deckId === deckId
    )
  }

  async getDueCards(date: Date, deckId?: string): Promise<Card[]> {
    let cards = Array.from(this.cards.values())

    if (deckId) {
      cards = cards.filter((card) => card.deckId === deckId)
    }

    return cards.filter((card) => card.due <= date)
  }

  async saveCard(card: Card): Promise<void> {
    this.cards.set(card.id, { ...card, modified: new Date() })
  }

  async deleteCard(id: string): Promise<void> {
    this.cards.delete(id)
  }

  async getCardCount(deckId: string): Promise<number> {
    return Array.from(this.cards.values()).filter(
      (card) => card.deckId === deckId
    ).length
  }

  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values())
  }
}
