import { mysqlTable, varchar, text, timestamp, double, int, tinyint } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

/**
 * Decks Table
 * Collections of flashcards organized by topic
 */
export const decks = mysqlTable('decks', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  created: timestamp('created').notNull().defaultNow(),
  modified: timestamp('modified').notNull().defaultNow().onUpdateNow(),
})

/**
 * Cards Table
 * Individual flashcards with FSRS scheduling metadata
 */
export const cards = mysqlTable('cards', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  deckId: varchar('deck_id', { length: 36 })
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull(),
  
  // Card content
  front: text('front').notNull(),
  back: text('back').notNull(),
  
  // Metadata
  created: timestamp('created').notNull().defaultNow(),
  modified: timestamp('modified').notNull().defaultNow().onUpdateNow(),
  
  // FSRS scheduling data
  due: timestamp('due').notNull().defaultNow(),
  stability: double('stability').notNull().default(1.0),
  difficulty: double('difficulty').notNull().default(5.0),
  elapsedDays: int('elapsed_days').notNull().default(0),
  scheduledDays: int('scheduled_days').notNull().default(0),
  reps: int('reps').notNull().default(0),
  lapses: int('lapses').notNull().default(0),
  state: tinyint('state').notNull().default(0), // 0: New, 1: Learning, 2: Review, 3: Relearning
  lastReview: timestamp('last_review'),
})

/**
 * Review Logs Table
 * Historical record of all review sessions
 */
export const reviewLogs = mysqlTable('review_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  cardId: varchar('card_id', { length: 36 })
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull(),
  
  // Review data
  rating: tinyint('rating').notNull(), // 1: Again, 2: Hard, 3: Good, 4: Easy
  state: tinyint('state').notNull(),
  due: timestamp('due').notNull(),
  stability: double('stability').notNull(),
  difficulty: double('difficulty').notNull(),
  elapsedDays: int('elapsed_days').notNull(),
  scheduledDays: int('scheduled_days').notNull(),
  review: timestamp('review').notNull().defaultNow(),
})

// Type exports for use in application code
export type Deck = typeof decks.$inferSelect
export type NewDeck = typeof decks.$inferInsert

export type Card = typeof cards.$inferSelect
export type NewCard = typeof cards.$inferInsert

export type ReviewLog = typeof reviewLogs.$inferSelect
export type NewReviewLog = typeof reviewLogs.$inferInsert
