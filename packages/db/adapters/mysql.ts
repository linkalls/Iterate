import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '../schema/mysql'

const connectionUrl = process.env.DATABASE_URL || ''

// Create connection pool
const pool = mysql.createPool(connectionUrl)

// Create drizzle instance
export const db = drizzle(pool, { schema, mode: 'default' })

// Export pool for direct access if needed
export const mysqlPool = pool

export * from '../schema/mysql'
