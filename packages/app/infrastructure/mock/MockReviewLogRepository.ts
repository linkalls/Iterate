import { ReviewLog } from '../../domain/model'
import { ReviewLogRepository } from '../../domain/repository'

/**
 * MockReviewLogRepository
 * In-memory implementation for development and testing
 */
export class MockReviewLogRepository implements ReviewLogRepository {
  private logs: Map<string, ReviewLog> = new Map()

  async getLogsForCard(cardId: string): Promise<ReviewLog[]> {
    return Array.from(this.logs.values()).filter(
      (log) => log.cardId === cardId
    )
  }

  async getLogsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ReviewLog[]> {
    return Array.from(this.logs.values()).filter(
      (log) => log.review >= startDate && log.review <= endDate
    )
  }

  async saveLog(log: ReviewLog): Promise<void> {
    this.logs.set(log.id, log)
  }

  async getDeckStats(deckId: string): Promise<{
    totalReviews: number
    averageRating: number
    retentionRate: number
  }> {
    const logs = Array.from(this.logs.values())
    const totalReviews = logs.length

    if (totalReviews === 0) {
      return { totalReviews: 0, averageRating: 0, retentionRate: 0 }
    }

    const totalRating = logs.reduce((sum, log) => sum + log.rating, 0)
    const averageRating = totalRating / totalReviews

    const successfulReviews = logs.filter((log) => log.rating >= 3).length
    const retentionRate = (successfulReviews / totalReviews) * 100

    return { totalReviews, averageRating, retentionRate }
  }
}
