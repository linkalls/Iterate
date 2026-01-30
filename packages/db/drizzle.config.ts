import { defineConfig } from 'drizzle-kit'

// Database type from environment variable (default: postgres)
const dbType = process.env.DB_TYPE || 'postgres'

const getConfig = () => {
  switch (dbType) {
    case 'sqlite':
      return defineConfig({
        schema: './schema/sqlite.ts',
        out: './migrations/sqlite',
        dialect: 'sqlite',
        dbCredentials: {
          url: process.env.DATABASE_PATH || './data.db',
        },
      })
    case 'mysql':
      return defineConfig({
        schema: './schema/mysql.ts',
        out: './migrations/mysql',
        dialect: 'mysql',
        dbCredentials: {
          url: process.env.DATABASE_URL || '',
        },
      })
    case 'postgres':
    default:
      return defineConfig({
        schema: './schema/pg.ts',
        out: './migrations/pg',
        dialect: 'postgresql',
        dbCredentials: {
          url: process.env.DATABASE_URL || '',
        },
      })
  }
}

export default getConfig()
