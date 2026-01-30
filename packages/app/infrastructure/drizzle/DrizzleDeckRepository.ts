import { eq } from 'drizzle-orm'
import { db, decks, type Deck as DBDeck, type NewDeck } from 'db'
import { DeckRepository } from '../../domain/repository'
import { Deck } from '../../domain/model'

/**
 * DrizzleDeckRepository
 * Production implementation using Drizzle ORM
 */
export class DrizzleDeckRepository implements DeckRepository {
  async getDeck(id: string): Promise<Deck | null> {
    const result = await db.query.decks.findFirst({
      where: eq(decks.id, id),
    })

    return result ? this.mapToDeck(result) : null
  }

  async getAllDecks(): Promise<Deck[]> {
    const result = await db.query.decks.findMany({
      orderBy: (decks, { desc }) => [desc(decks.modified)],
    })

    return result.map(this.mapToDeck)
  }

  async saveDeck(deck: Deck): Promise<void> {
    const dbDeck = this.mapFromDeck(deck)

    await db
      .insert(decks)
      .values(dbDeck)
      .onConflictDoUpdate({
        target: decks.id,
        set: {
          ...dbDeck,
          modified: new Date(),
        },
      })
  }

  async deleteDeck(id: string): Promise<void> {
    await db.delete(decks).where(eq(decks.id, id))
  }

  private mapToDeck(dbDeck: DBDeck): Deck {
    return {
      id: dbDeck.id,
      name: dbDeck.name,
      description: dbDeck.description || undefined,
      created: dbDeck.created,
      modified: dbDeck.modified,
    }
  }

  private mapFromDeck(deck: Deck): NewDeck {
    return {
      id: deck.id,
      userId: 'current-user', // TODO: Get from auth context
      name: deck.name,
      description: deck.description || null,
      created: deck.created,
      modified: deck.modified,
    }
  }
}
