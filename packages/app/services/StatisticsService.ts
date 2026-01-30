import { Card, CardState } from '../domain/model'

export interface DailyStats {
  date: Date
  reviewed: number
  newCards: number
}

export interface StudyStatistics {
  // Overall stats
  totalCards: number
  newCards: number
  learningCards: number
  reviewCards: number
  
  // Today stats
  cardsReviewedToday: number
  cardsStudiedToday: number
  
  // This week stats
  cardsReviewedThisWeek: number
  cardsStudiedThisWeek: number
  
  // Retention
  totalReviews: number
  averageRetention: number
  
  // Study streak
  currentStreak: number
  longestStreak: number
  
  // Daily breakdown
  dailyStats: DailyStats[]
}

export class StatisticsService {
  /**
   * Calculate comprehensive statistics from cards
   */
  static calculateStatistics(cards: Card[]): StudyStatistics {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    // Count cards by state
    let newCards = 0
    let learningCards = 0
    let reviewCards = 0
    
    // Count reviews
    let cardsReviewedToday = 0
    let cardsReviewedThisWeek = 0
    let totalReviews = 0
    
    // Track unique cards reviewed
    const cardsReviewedTodaySet = new Set<string>()
    const cardsReviewedThisWeekSet = new Set<string>()
    
    cards.forEach(card => {
      // Count by state
      switch (card.state) {
        case CardState.New:
          newCards++
          break
        case CardState.Learning:
        case CardState.Relearning:
          learningCards++
          break
        case CardState.Review:
          reviewCards++
          break
      }
      
      // Count reviews
      totalReviews += card.reps
      
      // Check if reviewed today
      if (card.last_review) {
        const reviewDate = new Date(card.last_review)
        
        if (reviewDate >= today) {
          cardsReviewedTodaySet.add(card.id)
        }
        
        if (reviewDate >= weekAgo) {
          cardsReviewedThisWeekSet.add(card.id)
        }
      }
    })
    
    cardsReviewedToday = cardsReviewedTodaySet.size
    cardsReviewedThisWeek = cardsReviewedThisWeekSet.size
    
    // Calculate retention (simplified: cards in review state vs total non-new)
    const matureCards = reviewCards
    const totalStudiedCards = learningCards + reviewCards
    const averageRetention = totalStudiedCards > 0 
      ? (matureCards / totalStudiedCards) * 100 
      : 0
    
    return {
      totalCards: cards.length,
      newCards,
      learningCards,
      reviewCards,
      cardsReviewedToday,
      cardsStudiedToday: cardsReviewedToday, // Same for now
      cardsReviewedThisWeek,
      cardsStudiedThisWeek: cardsReviewedThisWeek,
      totalReviews,
      averageRetention,
      currentStreak: 0, // TODO: Implement streak tracking
      longestStreak: 0,
      dailyStats: [], // TODO: Implement daily breakdown
    }
  }
  
  /**
   * Get a human-readable summary of progress
   */
  static getProgressSummary(stats: StudyStatistics): string {
    const { cardsReviewedToday } = stats
    
    if (cardsReviewedToday === 0) {
      return "Start studying to see your progress!"
    }
    
    if (cardsReviewedToday >= 30) {
      return "Amazing dedication! You're crushing it! 🌟"
    }
    
    if (cardsReviewedToday >= 10) {
      return "Great work today! You're on fire! 🔥"
    }
    
    return "Good start! Keep it up! 💪"
  }
}
