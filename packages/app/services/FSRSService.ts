import { FSRS, Rating as FSRSRating, Card as FSRSCard, Grade, State } from 'ts-fsrs'
import { Card, Rating, CardState } from '../domain/model'

/**
 * FSRSService
 * Wrapper around ts-fsrs library to integrate with our domain models
 */
export class FSRSService {
  private fsrs: FSRS

  constructor() {
    this.fsrs = new FSRS()
  }

  /**
   * Convert our Card model to ts-fsrs Card format
   */
  private toFSRSCard(card: Card): FSRSCard {
    return {
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: card.elapsed_days,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: this.toFSRSState(card.state),
      last_review: card.last_review,
    }
  }

  /**
   * Convert our Rating to ts-fsrs Grade
   */
  private toFSRSGrade(rating: Rating): Grade {
    switch (rating) {
      case Rating.Again:
        return Grade.Again
      case Rating.Hard:
        return Grade.Hard
      case Rating.Good:
        return Grade.Good
      case Rating.Easy:
        return Grade.Easy
      default:
        return Grade.Good
    }
  }

  /**
   * Convert our CardState to ts-fsrs State
   */
  private toFSRSState(state: CardState): State {
    switch (state) {
      case CardState.New:
        return State.New
      case CardState.Learning:
        return State.Learning
      case CardState.Review:
        return State.Review
      case CardState.Relearning:
        return State.Relearning
      default:
        return State.New
    }
  }

  /**
   * Convert ts-fsrs State back to our CardState
   */
  private fromFSRSState(state: State): CardState {
    switch (state) {
      case State.New:
        return CardState.New
      case State.Learning:
        return CardState.Learning
      case State.Review:
        return CardState.Review
      case State.Relearning:
        return CardState.Relearning
      default:
        return CardState.New
    }
  }

  /**
   * Process a card review and return the updated card
   */
  reviewCard(card: Card, rating: Rating, now: Date = new Date()): Card {
    const fsrsCard = this.toFSRSCard(card)
    const grade = this.toFSRSGrade(rating)

    // Use FSRS to calculate the next review
    const schedulingCards = this.fsrs.repeat(fsrsCard, now)

    // Get the card for the selected grade
    const recordLog = schedulingCards[grade]
    const updatedFSRSCard = recordLog.card

    // Merge the FSRS updates back into our card
    return {
      ...card,
      due: updatedFSRSCard.due,
      stability: updatedFSRSCard.stability,
      difficulty: updatedFSRSCard.difficulty,
      elapsed_days: updatedFSRSCard.elapsed_days,
      scheduled_days: updatedFSRSCard.scheduled_days,
      reps: updatedFSRSCard.reps,
      lapses: updatedFSRSCard.lapses,
      state: this.fromFSRSState(updatedFSRSCard.state),
      last_review: now,
      modified: now,
    }
  }

  /**
   * Get the interval information for all ratings
   * Useful for showing "Again: 10m, Hard: 1d, Good: 3d, Easy: 7d"
   */
  getSchedulingInfo(card: Card, now: Date = new Date()) {
    const fsrsCard = this.toFSRSCard(card)
    const schedulingCards = this.fsrs.repeat(fsrsCard, now)

    return {
      again: {
        interval: this.formatInterval(schedulingCards[Grade.Again].card.scheduled_days),
        card: schedulingCards[Grade.Again].card,
      },
      hard: {
        interval: this.formatInterval(schedulingCards[Grade.Hard].card.scheduled_days),
        card: schedulingCards[Grade.Hard].card,
      },
      good: {
        interval: this.formatInterval(schedulingCards[Grade.Good].card.scheduled_days),
        card: schedulingCards[Grade.Good].card,
      },
      easy: {
        interval: this.formatInterval(schedulingCards[Grade.Easy].card.scheduled_days),
        card: schedulingCards[Grade.Easy].card,
      },
    }
  }

  /**
   * Format interval in human-readable format
   */
  private formatInterval(days: number): string {
    if (days < 1) {
      const minutes = Math.round(days * 24 * 60)
      return `${minutes}m`
    } else if (days < 30) {
      return `${Math.round(days)}d`
    } else if (days < 365) {
      const months = Math.round(days / 30)
      return `${months}mo`
    } else {
      const years = Math.round(days / 365)
      return `${years}y`
    }
  }
}

// Singleton instance
export const fsrsService = new FSRSService()
