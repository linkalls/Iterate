import { atom } from 'jotai'
import {
  CardRepository,
  DeckRepository,
  ReviewLogRepository,
  CardTemplateRepository,
} from '../domain/repository'
import {
  MockCardRepository,
  MockDeckRepository,
  MockReviewLogRepository,
  MockCardTemplateRepository,
} from '../infrastructure/mock'

/**
 * Repository Atoms
 * These atoms hold the repository implementations.
 * By default, we use Mock implementations for development.
 * To switch to Supabase, replace with SupabaseCardRepository etc.
 */

// Initialize with Mock implementations
export const cardRepositoryAtom = atom<CardRepository>(
  new MockCardRepository()
)

export const deckRepositoryAtom = atom<DeckRepository>(
  new MockDeckRepository()
)

export const reviewLogRepositoryAtom = atom<ReviewLogRepository>(
  new MockReviewLogRepository()
)

export const cardTemplateRepositoryAtom = atom<CardTemplateRepository>(
  new MockCardTemplateRepository()
)

/**
 * Data Atoms
 * These atoms provide data derived from repositories
 */

// Get all decks
export const decksAtom = atom(async (get) => {
  const repo = get(deckRepositoryAtom)
  return await repo.getAllDecks()
})

// Get due cards for today
export const dueCardsAtom = atom(async (get) => {
  const repo = get(cardRepositoryAtom)
  const today = new Date()
  return await repo.getDueCards(today)
})

// Selected deck ID for filtering
export const selectedDeckIdAtom = atom<string | null>(null)

// Get cards for selected deck
export const deckCardsAtom = atom(async (get) => {
  const repo = get(cardRepositoryAtom)
  const deckId = get(selectedDeckIdAtom)

  if (!deckId) return []
  return await repo.getCardsByDeck(deckId)
})

// Get due cards for selected deck
export const deckDueCardsAtom = atom(async (get) => {
  const repo = get(cardRepositoryAtom)
  const deckId = get(selectedDeckIdAtom)

  if (!deckId) return []
  const today = new Date()
  return await repo.getDueCards(today, deckId)
})

// Get all templates
export const templatesAtom = atom(async (get) => {
  const repo = get(cardTemplateRepositoryAtom)
  return await repo.getAllTemplates()
})

/**
 * Study Session State
 */
export const currentCardIndexAtom = atom(0)
export const showAnswerAtom = atom(false)
export const sessionCompleteAtom = atom(false)
