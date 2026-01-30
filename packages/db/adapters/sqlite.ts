import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../schema/sqlite'

const dbPath = process.env.DATABASE_PATH || './data.db'

// Create database instance
const sqlite = new Database(dbPath)

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL')

// Create drizzle instance
export const db = drizzle(sqlite, { schema })

// Export the raw sqlite instance for migrations
export const sqliteInstance = sqlite

export * from '../schema/sqlite'
