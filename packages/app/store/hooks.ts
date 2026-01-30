import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  cardRepositoryAtom,
  deckRepositoryAtom,
  reviewLogRepositoryAtom,
  decksAtom,
  dueCardsAtom,
  selectedDeckIdAtom,
  deckCardsAtom,
  deckDueCardsAtom,
  currentCardIndexAtom,
  showAnswerAtom,
  sessionCompleteAtom,
} from './atoms'

/**
 * Custom hooks for easier state access
 */

// Repository hooks
export const useCardRepository = () => useAtomValue(cardRepositoryAtom)
export const useDeckRepository = () => useAtomValue(deckRepositoryAtom)
export const useReviewLogRepository = () =>
  useAtomValue(reviewLogRepositoryAtom)

// Data hooks
export const useDecks = () => useAtomValue(decksAtom)
export const useDueCards = () => useAtomValue(dueCardsAtom)
export const useSelectedDeckId = () => useAtom(selectedDeckIdAtom)
export const useDeckCards = () => useAtomValue(deckCardsAtom)
export const useDeckDueCards = () => useAtomValue(deckDueCardsAtom)

// Study session hooks
export const useCurrentCardIndex = () => useAtom(currentCardIndexAtom)
export const useShowAnswer = () => useAtom(showAnswerAtom)
export const useSessionComplete = () => useAtom(sessionCompleteAtom)

export const useResetStudySession = () => {
  const setCardIndex = useSetAtom(currentCardIndexAtom)
  const setShowAnswer = useSetAtom(showAnswerAtom)
  const setSessionComplete = useSetAtom(sessionCompleteAtom)

  return () => {
    setCardIndex(0)
    setShowAnswer(false)
    setSessionComplete(false)
  }
}
