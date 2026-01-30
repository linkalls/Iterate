// Re-export PostgreSQL schema for backwards compatibility
// For specific database schemas, import from:
//   - 'db/schema/pg' for PostgreSQL
//   - 'db/schema/sqlite' for SQLite
//   - 'db/schema/mysql' for MySQL
export * from './schema/pg'
