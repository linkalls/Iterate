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
  
  // Media support (Phase 5)
  frontImage?: string  // URL or base64
  backImage?: string   // URL or base64
  frontAudio?: string  // URL or base64
  backAudio?: string   // URL or base64
  
  // Card template reference (Phase 5)
  templateId?: string
  
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

/**
 * Card Template Model (Phase 5)
 * A template for creating multiple similar cards
 */
export interface CardTemplate {
  id: string
  name: string
  description?: string
  deckId?: string  // Optional: associate with a deck
  frontTemplate: string  // Template with placeholders like {{field1}}
  backTemplate: string
  fields: string[]  // Field names used in the template
  created: Date
  modified: Date
}
