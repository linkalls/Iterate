/**
 * Card Model
 * Represents a flashcard with FSRS metadata
 */
export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  created: Date
  modified: Date
  
  // FSRS scheduling data
  due: Date
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: CardState
  last_review?: Date
}

export enum CardState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

/**
 * Deck Model
 * A collection of cards for a specific topic
 */
export interface Deck {
  id: string
  name: string
  description?: string
  created: Date
  modified: Date
}

/**
 * Review Log Model
 * Records each review session
 */
export interface ReviewLog {
  id: string
  cardId: string
  rating: Rating
  state: CardState
  due: Date
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  review: Date
}

export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}
