import { eq, and, lte } from 'drizzle-orm'
import { db, cards, type Card as DBCard, type NewCard } from 'db'
import { CardRepository } from '../../domain/repository'
import { Card, CardState } from '../../domain/model'

/**
 * DrizzleCardRepository
 * Production implementation using Drizzle ORM
 */
export class DrizzleCardRepository implements CardRepository {
  async getCard(id: string): Promise<Card | null> {
    const result = await db.query.cards.findFirst({
      where: eq(cards.id, id),
    })

    return result ? this.mapToCard(result) : null
  }

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    const result = await db.query.cards.findMany({
      where: eq(cards.deckId, deckId),
      orderBy: (cards, { asc }) => [asc(cards.created)],
    })

    return result.map(this.mapToCard)
  }

  async getDueCards(date: Date, deckId?: string): Promise<Card[]> {
    const conditions = deckId
      ? and(lte(cards.due, date), eq(cards.deckId, deckId))
      : lte(cards.due, date)

    const result = await db.query.cards.findMany({
      where: conditions,
      orderBy: (cards, { asc }) => [asc(cards.due)],
    })

    return result.map(this.mapToCard)
  }

  async saveCard(card: Card): Promise<void> {
    const dbCard = this.mapFromCard(card)

    await db
      .insert(cards)
      .values(dbCard)
      .onConflictDoUpdate({
        target: cards.id,
        set: {
          ...dbCard,
          modified: new Date(),
        },
      })
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id))
  }

  async getCardCount(deckId: string): Promise<number> {
    const result = await db.query.cards.findMany({
      where: eq(cards.deckId, deckId),
    })

    return result.length
  }

  async getAllCards(): Promise<Card[]> {
    const result = await db.query.cards.findMany({
      orderBy: (cards, { asc }) => [asc(cards.created)],
    })

    return result.map(this.mapToCard)
  }

  private mapToCard(dbCard: DBCard): Card {
    return {
      id: dbCard.id,
      deckId: dbCard.deckId,
      front: dbCard.front,
      back: dbCard.back,
      created: dbCard.created,
      modified: dbCard.modified,
      due: dbCard.due,
      stability: dbCard.stability,
      difficulty: dbCard.difficulty,
      elapsed_days: dbCard.elapsedDays,
      scheduled_days: dbCard.scheduledDays,
      reps: dbCard.reps,
      lapses: dbCard.lapses,
      state: dbCard.state as CardState,
      last_review: dbCard.lastReview || undefined,
    }
  }

  private mapFromCard(card: Card): NewCard {
    return {
      id: card.id,
      deckId: card.deckId,
      userId: 'current-user', // TODO: Get from auth context
      front: card.front,
      back: card.back,
      created: card.created,
      modified: card.modified,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsedDays: card.elapsed_days,
      scheduledDays: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      lastReview: card.last_review || null,
    }
  }
}
