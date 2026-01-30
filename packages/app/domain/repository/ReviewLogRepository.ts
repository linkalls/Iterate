import { ReviewLog } from '../model'

/**
 * ReviewLogRepository Interface
 * Defines operations for review history management
 */
export interface ReviewLogRepository {
  /**
   * Get review logs for a specific card
   */
  getLogsForCard(cardId: string): Promise<ReviewLog[]>

  /**
   * Get review logs for a date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): Promise<ReviewLog[]>

  /**
   * Save a review log entry
   */
  saveLog(log: ReviewLog): Promise<void>

  /**
   * Get statistics for a deck
   */
  getDeckStats(deckId: string): Promise<{
    totalReviews: number
    averageRating: number
    retentionRate: number
  }>
}
