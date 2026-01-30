import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * Decks Table
 * Collections of flashcards organized by topic
 */
export const decks = sqliteTable('decks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  created: integer('created', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  modified: integer('modified', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
})

/**
 * Cards Table
 * Individual flashcards with FSRS scheduling metadata
 */
export const cards = sqliteTable('cards', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  deckId: text('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  
  // Card content
  front: text('front').notNull(),
  back: text('back').notNull(),
  
  // Metadata
  created: integer('created', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  modified: integer('modified', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  
  // FSRS scheduling data
  due: integer('due', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  stability: real('stability').notNull().default(1.0),
  difficulty: real('difficulty').notNull().default(5.0),
  elapsedDays: integer('elapsed_days').notNull().default(0),
  scheduledDays: integer('scheduled_days').notNull().default(0),
  reps: integer('reps').notNull().default(0),
  lapses: integer('lapses').notNull().default(0),
  state: integer('state').notNull().default(0), // 0: New, 1: Learning, 2: Review, 3: Relearning
  lastReview: integer('last_review', { mode: 'timestamp' }),
})

/**
 * Review Logs Table
 * Historical record of all review sessions
 */
export const reviewLogs = sqliteTable('review_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  
  // Review data
  rating: integer('rating').notNull(), // 1: Again, 2: Hard, 3: Good, 4: Easy
  state: integer('state').notNull(),
  due: integer('due', { mode: 'timestamp' }).notNull(),
  stability: real('stability').notNull(),
  difficulty: real('difficulty').notNull(),
  elapsedDays: integer('elapsed_days').notNull(),
  scheduledDays: integer('scheduled_days').notNull(),
  review: integer('review', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
})

// Type exports for use in application code
export type Deck = typeof decks.$inferSelect
export type NewDeck = typeof decks.$inferInsert

export type Card = typeof cards.$inferSelect
export type NewCard = typeof cards.$inferInsert

export type ReviewLog = typeof reviewLogs.$inferSelect
export type NewReviewLog = typeof reviewLogs.$inferInsert
