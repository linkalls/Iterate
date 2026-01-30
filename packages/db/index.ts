// Default export using PostgreSQL (backwards compatible)
// For specific database adapters, import from:
//   - 'db/pg' for PostgreSQL
//   - 'db/sqlite' for SQLite
//   - 'db/mysql' for MySQL
export * from './adapters/pg'

// Re-export schema types for convenience
export type {
  Deck,
  NewDeck,
  Card,
  NewCard,
  ReviewLog,
  NewReviewLog,
} from './schema/pg'

