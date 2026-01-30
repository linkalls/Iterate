import { Card } from '../../domain/model'
import { CardRepository } from '../../domain/repository'
import { supabase } from './client'

/**
 * SupabaseCardRepository
 * Production implementation using Supabase as the backend
 * 
 * Note: This is a placeholder. To use:
 * 1. Install @supabase/supabase-js
 * 2. Set up environment variables
 * 3. Create the cards table in Supabase
 */
export class SupabaseCardRepository implements CardRepository {
  async getCard(id: string): Promise<Card | null> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? this.mapToCard(data) : null
  }

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)

    if (error) throw error
    return data.map(this.mapToCard)
  }

  async getDueCards(date: Date, deckId?: string): Promise<Card[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    let query = supabase.from('cards').select('*').lte('due', date.toISOString())

    if (deckId) {
      query = query.eq('deck_id', deckId)
    }

    const { data, error } = await query
    if (error) throw error
    return data.map(this.mapToCard)
  }

  async saveCard(card: Card): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.from('cards').upsert(this.mapFromCard(card))
    if (error) throw error
  }

  async deleteCard(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) throw error
  }

  async getCardCount(deckId: string): Promise<number> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { count, error } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', deckId)

    if (error) throw error
    return count || 0
  }

  private mapToCard(data: any): Card {
    return {
      id: data.id,
      deckId: data.deck_id,
      front: data.front,
      back: data.back,
      created: new Date(data.created),
      modified: new Date(data.modified),
      due: new Date(data.due),
      stability: data.stability,
      difficulty: data.difficulty,
      elapsed_days: data.elapsed_days,
      scheduled_days: data.scheduled_days,
      reps: data.reps,
      lapses: data.lapses,
      state: data.state,
      last_review: data.last_review ? new Date(data.last_review) : undefined,
    }
  }

  private mapFromCard(card: Card): any {
    return {
      id: card.id,
      deck_id: card.deckId,
      front: card.front,
      back: card.back,
      created: card.created.toISOString(),
      modified: card.modified.toISOString(),
      due: card.due.toISOString(),
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: card.elapsed_days,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      last_review: card.last_review?.toISOString(),
    }
  }
}
