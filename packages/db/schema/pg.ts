import { pgTable, uuid, text, timestamp, real, integer, smallint } from 'drizzle-orm/pg-core'

/**
 * Decks Table
 * Collections of flashcards organized by topic
 */
export const decks = pgTable('decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  created: timestamp('created').notNull().defaultNow(),
  modified: timestamp('modified').notNull().defaultNow(),
})

/**
 * Cards Table
 * Individual flashcards with FSRS scheduling metadata
 */
export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  deckId: uuid('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  
  // Card content
  front: text('front').notNull(),
  back: text('back').notNull(),
  
  // Metadata
  created: timestamp('created').notNull().defaultNow(),
  modified: timestamp('modified').notNull().defaultNow(),
  
  // FSRS scheduling data
  due: timestamp('due').notNull().defaultNow(),
  stability: real('stability').notNull().default(1.0),
  difficulty: real('difficulty').notNull().default(5.0),
  elapsedDays: integer('elapsed_days').notNull().default(0),
  scheduledDays: integer('scheduled_days').notNull().default(0),
  reps: integer('reps').notNull().default(0),
  lapses: integer('lapses').notNull().default(0),
  state: smallint('state').notNull().default(0), // 0: New, 1: Learning, 2: Review, 3: Relearning
  lastReview: timestamp('last_review'),
})

/**
 * Review Logs Table
 * Historical record of all review sessions
 */
export const reviewLogs = pgTable('review_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  
  // Review data
  rating: smallint('rating').notNull(), // 1: Again, 2: Hard, 3: Good, 4: Easy
  state: smallint('state').notNull(),
  due: timestamp('due').notNull(),
  stability: real('stability').notNull(),
  difficulty: real('difficulty').notNull(),
  elapsedDays: integer('elapsed_days').notNull(),
  scheduledDays: integer('scheduled_days').notNull(),
  review: timestamp('review').notNull().defaultNow(),
})

// Type exports for use in application code
export type Deck = typeof decks.$inferSelect
export type NewDeck = typeof decks.$inferInsert

export type Card = typeof cards.$inferSelect
export type NewCard = typeof cards.$inferInsert

export type ReviewLog = typeof reviewLogs.$inferSelect
export type NewReviewLog = typeof reviewLogs.$inferInsert
