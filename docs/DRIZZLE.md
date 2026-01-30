# Drizzle ORM Integration Guide

This guide explains how to use Drizzle ORM with Iterate for database management.

## Why Drizzle?

- **Type-safe**: Full TypeScript support with excellent type inference
- **Performant**: Generates optimized SQL queries
- **Flexible**: Works with PostgreSQL, MySQL, and SQLite
- **Developer-friendly**: SQL-like syntax that feels natural
- **Migrations**: Built-in migration system

## Setup

### 1. Install Dependencies

```bash
cd packages/db
bun install
```

### 2. Configure Database Connection

Create a `.env` file in your project root:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/iterate"
```

### 3. Generate Migrations

```bash
cd packages/db
bun run drizzle-kit generate:pg
```

### 4. Run Migrations

```bash
cd packages/db
bun run drizzle-kit push:pg
```

## Schema

The database schema is defined in `packages/db/schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const decks = pgTable('decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  // ... more fields
})
```

## Usage

### Basic Queries

```typescript
import { db, cards, decks } from 'db'
import { eq } from 'drizzle-orm'

// Select all decks
const allDecks = await db.select().from(decks)

// Select with filter
const deck = await db.select()
  .from(decks)
  .where(eq(decks.id, deckId))

// Insert
await db.insert(cards).values({
  deckId: 'deck-id',
  front: 'Question',
  back: 'Answer',
  // ... more fields
})

// Update
await db.update(cards)
  .set({ front: 'Updated question' })
  .where(eq(cards.id, cardId))

// Delete
await db.delete(cards)
  .where(eq(cards.id, cardId))
```

### With Repository Pattern

The `DrizzleCardRepository` wraps Drizzle queries in the repository interface:

```typescript
import { DrizzleCardRepository } from 'app/infrastructure/drizzle'

const cardRepo = new DrizzleCardRepository()

// Use the same interface as MockCardRepository
const cards = await cardRepo.getDueCards(new Date())
```

### Switching from Mock to Drizzle

In `packages/app/store/atoms.ts`:

```typescript
// Development (Mock)
import { MockCardRepository } from '../infrastructure/mock'
export const cardRepositoryAtom = atom(new MockCardRepository())

// Production (Drizzle)
import { DrizzleCardRepository } from '../infrastructure/drizzle'
export const cardRepositoryAtom = atom(new DrizzleCardRepository())
```

## Relational Queries

Drizzle supports powerful relational queries:

```typescript
// Get deck with all its cards
const deckWithCards = await db.query.decks.findFirst({
  where: eq(decks.id, deckId),
  with: {
    cards: true,
  },
})

// Get cards with deck information
const cardsWithDeck = await db.query.cards.findMany({
  where: eq(cards.deckId, deckId),
  with: {
    deck: true,
  },
})
```

## Migrations

### Create a new migration

```bash
cd packages/db
bun run drizzle-kit generate:pg
```

### Apply migrations

```bash
bun run drizzle-kit push:pg
```

### Check migration status

```bash
bun run drizzle-kit status
```

## Type Safety

Drizzle provides excellent type inference:

```typescript
// Infer select types
type Deck = typeof decks.$inferSelect
type NewDeck = typeof decks.$inferInsert

// Use in your code
const newDeck: NewDeck = {
  userId: 'user-id',
  name: 'My Deck',
  description: 'A collection of cards',
}

await db.insert(decks).values(newDeck)
```

## Performance Tips

### 1. Use Prepared Statements

```typescript
const getDueCardsStmt = db.select()
  .from(cards)
  .where(lte(cards.due, sql.placeholder('date')))
  .prepare('get_due_cards')

const dueCards = await getDueCardsStmt.execute({ date: new Date() })
```

### 2. Batch Operations

```typescript
// Insert multiple cards at once
await db.insert(cards).values([
  { deckId, front: 'Q1', back: 'A1' },
  { deckId, front: 'Q2', back: 'A2' },
  { deckId, front: 'Q3', back: 'A3' },
])
```

### 3. Select Only What You Need

```typescript
// Don't fetch all columns if you don't need them
const cardFronts = await db.select({ id: cards.id, front: cards.front })
  .from(cards)
  .where(eq(cards.deckId, deckId))
```

## Database Providers

### PostgreSQL (Recommended)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(connectionString)
const db = drizzle(client)
```

### Supabase

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.SUPABASE_DATABASE_URL!)
const db = drizzle(client)
```

### SQLite (For offline)

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const sqlite = new Database('iterate.db')
const db = drizzle(sqlite)
```

## Troubleshooting

### "Cannot find module 'db'"

Make sure you're using workspace references in package.json:

```json
{
  "dependencies": {
    "db": "workspace:*"
  }
}
```

Then run `bun install` from the root.

### Connection errors

Check your DATABASE_URL is correct:

```bash
echo $DATABASE_URL
```

### Migration conflicts

If migrations fail, you can reset:

```bash
bun run drizzle-kit drop
bun run drizzle-kit push:pg
```

## Resources

- [Drizzle Documentation](https://orm.drizzle.team)
- [Drizzle GitHub](https://github.com/drizzle-team/drizzle-orm)
- [SQL Queries Guide](https://orm.drizzle.team/docs/select)
- [Migrations Guide](https://orm.drizzle.team/docs/migrations)
