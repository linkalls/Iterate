import { Deck } from '../../domain/model'
import { DeckRepository } from '../../domain/repository'

/**
 * MockDeckRepository
 * In-memory implementation for development and testing
 */
export class MockDeckRepository implements DeckRepository {
  private decks: Map<string, Deck> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    const sampleDecks: Deck[] = [
      {
        id: 'deck-1',
        name: 'English Vocabulary',
        description: 'Common English words and phrases',
        created: new Date('2024-01-01'),
        modified: new Date('2024-01-01'),
      },
      {
        id: 'deck-2',
        name: 'Programming Concepts',
        description: 'Key programming terms and algorithms',
        created: new Date('2024-01-02'),
        modified: new Date('2024-01-02'),
      },
    ]

    sampleDecks.forEach((deck) => this.decks.set(deck.id, deck))
  }

  async getDeck(id: string): Promise<Deck | null> {
    return this.decks.get(id) || null
  }

  async getAllDecks(): Promise<Deck[]> {
    return Array.from(this.decks.values())
  }

  async saveDeck(deck: Deck): Promise<void> {
    this.decks.set(deck.id, { ...deck, modified: new Date() })
  }

  async deleteDeck(id: string): Promise<void> {
    this.decks.delete(id)
  }
}
