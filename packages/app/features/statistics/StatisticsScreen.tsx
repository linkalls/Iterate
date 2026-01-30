import React, { useState, useEffect } from 'react'
import {
  Screen,
  Container,
  Column,
  Row,
  Heading2,
  Heading3,
  Body,
  Caption,
  Card,
  Button,
  ButtonText,
} from 'ui'
import { Stack } from 'tamagui'
import { useCardRepository } from '../../store'
import { StatisticsService, StudyStatistics } from '../../services'

interface StatisticsScreenProps {
  onBack?: () => void
}

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const cardRepo = useCardRepository()
  const [stats, setStats] = useState<StudyStatistics | null>(null)
  const [cardsDue, setCardsDue] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        // Get all cards
        const allCards = await cardRepo.getAllCards()
        
        // Calculate statistics
        const statistics = StatisticsService.calculateStatistics(allCards)
        setStats(statistics)
        
        // Get cards due today
        const dueCards = await cardRepo.getDueCards(new Date())
        setCardsDue(dueCards.length)
      } catch (error) {
        console.error('Error loading statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [cardRepo])

  if (loading) {
    return (
      <Screen centered>
        <Body>Loading statistics...</Body>
      </Screen>
    )
  }

  if (!stats) {
    return (
      <Screen centered>
        <Container>
          <Column gap="lg">
            <Body style={{ textAlign: 'center' }}>
              Unable to load statistics.
            </Body>
            {onBack && (
              <Button onPress={onBack} fullWidth>
                <ButtonText>Go Back</ButtonText>
              </Button>
            )}
          </Column>
        </Container>
      </Screen>
    )
  }

  const progressMessage = StatisticsService.getProgressSummary(stats)

  return (
    <Screen>
      <Container>
        <Column gap="xl">
          {/* Header */}
          <Row justify="between">
            <Heading2>Statistics 📊</Heading2>
            {onBack && (
              <Button variant="ghost" onPress={onBack}>
                <ButtonText variant="ghost">Back</ButtonText>
              </Button>
            )}
          </Row>

          {/* Progress Summary */}
          <Card elevated style={{ backgroundColor: '$primary', padding: 20 }}>
            <Column gap="md">
              <Heading3 style={{ color: 'white' }}>
                {progressMessage}
              </Heading3>
              <Body style={{ color: 'white', opacity: 0.9 }}>
                Keep up the momentum and you'll master everything!
              </Body>
            </Column>
          </Card>

          {/* Today's Stats */}
          <Column gap="md">
            <Caption style={{ fontWeight: '600', fontSize: 14 }}>
              TODAY
            </Caption>
            <Row gap="md">
              <Card elevated style={{ flex: 1 }}>
                <Column gap="sm">
                  <Caption>Cards Reviewed</Caption>
                  <Heading3 style={{ color: '$primary' }}>
                    {stats.cardsReviewedToday}
                  </Heading3>
                </Column>
              </Card>
              <Card elevated style={{ flex: 1 }}>
                <Column gap="sm">
                  <Caption>Cards Due</Caption>
                  <Heading3>
                    {cardsDue}
                  </Heading3>
                </Column>
              </Card>
            </Row>
          </Column>

          {/* This Week's Stats */}
          <Column gap="md">
            <Caption style={{ fontWeight: '600', fontSize: 14 }}>
              THIS WEEK
            </Caption>
            <Row gap="md">
              <Card elevated style={{ flex: 1 }}>
                <Column gap="sm">
                  <Caption>Cards Reviewed</Caption>
                  <Heading3 style={{ color: '$primary' }}>
                    {stats.cardsReviewedThisWeek}
                  </Heading3>
                </Column>
              </Card>
              <Card elevated style={{ flex: 1 }}>
                <Column gap="sm">
                  <Caption>Total Reviews</Caption>
                  <Heading3>{stats.totalReviews}</Heading3>
                </Column>
              </Card>
            </Row>
          </Column>

          {/* Card Distribution */}
          <Column gap="md">
            <Caption style={{ fontWeight: '600', fontSize: 14 }}>
              CARD DISTRIBUTION
            </Caption>
            <Card elevated>
              <Column gap="lg">
                {/* New Cards */}
                <Row justify="between">
                  <Body>New Cards</Body>
                  <Row gap="md" style={{ alignItems: 'center' }}>
                    <Body style={{ fontWeight: '600' }}>{stats.newCards}</Body>
                    <Stack
                      width={100}
                      height={8}
                      backgroundColor="$surfaceVariant"
                      borderRadius="$full"
                      overflow="hidden"
                    >
                      <Stack
                        width={stats.totalCards > 0 ? `${(stats.newCards / stats.totalCards) * 100}%` : '0%'}
                        height="100%"
                        backgroundColor="$primary"
                      />
                    </Stack>
                  </Row>
                </Row>

                {/* Learning Cards */}
                <Row justify="between">
                  <Body>Learning</Body>
                  <Row gap="md" style={{ alignItems: 'center' }}>
                    <Body style={{ fontWeight: '600' }}>{stats.learningCards}</Body>
                    <Stack
                      width={100}
                      height={8}
                      backgroundColor="$surfaceVariant"
                      borderRadius="$full"
                      overflow="hidden"
                    >
                      <Stack
                        width={stats.totalCards > 0 ? `${(stats.learningCards / stats.totalCards) * 100}%` : '0%'}
                        height="100%"
                        backgroundColor="#F59E0B"
                      />
                    </Stack>
                  </Row>
                </Row>

                {/* Review Cards */}
                <Row justify="between">
                  <Body>Review</Body>
                  <Row gap="md" style={{ alignItems: 'center' }}>
                    <Body style={{ fontWeight: '600' }}>{stats.reviewCards}</Body>
                    <Stack
                      width={100}
                      height={8}
                      backgroundColor="$surfaceVariant"
                      borderRadius="$full"
                      overflow="hidden"
                    >
                      <Stack
                        width={stats.totalCards > 0 ? `${(stats.reviewCards / stats.totalCards) * 100}%` : '0%'}
                        height="100%"
                        backgroundColor="#10B981"
                      />
                    </Stack>
                  </Row>
                </Row>

                {/* Total */}
                <Row justify="between" style={{ paddingTop: 12, borderTopWidth: 1, borderTopColor: '$border' }}>
                  <Body style={{ fontWeight: '600' }}>Total Cards</Body>
                  <Body style={{ fontWeight: '600' }}>{stats.totalCards}</Body>
                </Row>
              </Column>
            </Card>
          </Column>

          {/* Retention Rate */}
          <Column gap="md">
            <Caption style={{ fontWeight: '600', fontSize: 14 }}>
              PERFORMANCE
            </Caption>
            <Card elevated>
              <Column gap="md">
                <Row justify="between">
                  <Body>Average Retention</Body>
                  <Heading3 style={{ color: stats.averageRetention > 70 ? '#10B981' : '$primary' }}>
                    {stats.averageRetention.toFixed(1)}%
                  </Heading3>
                </Row>
                <Stack
                  width="100%"
                  height={12}
                  backgroundColor="$surfaceVariant"
                  borderRadius="$full"
                  overflow="hidden"
                >
                  <Stack
                    width={`${stats.averageRetention}%`}
                    height="100%"
                    backgroundColor={stats.averageRetention > 70 ? '#10B981' : '$primary'}
                  />
                </Stack>
                <Caption style={{ textAlign: 'center', color: '$textSecondary' }}>
                  {stats.averageRetention > 80 ? "Excellent retention! 🌟" :
                   stats.averageRetention > 60 ? "Good progress! 👍" :
                   stats.averageRetention > 40 ? "Keep practicing! 💪" :
                   "Focus on consistent reviews 📚"}
                </Caption>
              </Column>
            </Card>
          </Column>

          {/* Tips */}
          <Card style={{ backgroundColor: '$surfaceVariant' }}>
            <Column gap="md">
              <Body style={{ fontWeight: '600' }}>💡 Pro Tips</Body>
              <Body style={{ fontSize: 14, lineHeight: 20 }}>
                • Review cards daily for best retention{'\n'}
                • Don't hesitate to mark cards as "Again"{'\n'}
                • The FSRS algorithm adapts to your pace{'\n'}
                • Consistency beats intensity
              </Body>
            </Column>
          </Card>
        </Column>
      </Container>
    </Screen>
  )
}
