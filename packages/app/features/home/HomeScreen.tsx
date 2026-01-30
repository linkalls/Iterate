import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import {
  Screen,
  Container,
  Column,
  Row,
  Heading1,
  Heading3,
  Body,
  Caption,
  Card,
  Button,
  ButtonText,
} from 'ui'
import { Stack } from 'tamagui'
import { themeAtom, toggleThemeAtom, useDueCards, useDecks } from '../../store'

interface HomeScreenProps {
  onStartStudy?: () => void
  onViewDecks?: () => void
  onViewStatistics?: () => void
}

export function HomeScreen({ onStartStudy, onViewDecks, onViewStatistics }: HomeScreenProps) {
  const [theme, toggleTheme] = useAtom(toggleThemeAtom)
  const dueCards = useDueCards()
  const decks = useDecks()

  const totalDecks = decks?.length || 0
  const totalDueCards = dueCards?.length || 0

  return (
    <Screen>
      <Container>
        <Column gap="2xl">
          {/* Header with theme switcher */}
          <Row justify="between">
            <Column gap="sm">
              <Heading1>Iterate 🦊</Heading1>
              <Caption>Evolve through repetition</Caption>
            </Column>

            <Button
              variant="ghost"
              onPress={() => toggleTheme()}
              size="lg"
              style={{ borderRadius: '$full', width: 56, height: 56 }}
            >
              <ButtonText variant="ghost" size="lg">
                {theme === 'light' ? '🌙' : '☀️'}
              </ButtonText>
            </Button>
          </Row>

          {/* Stats cards */}
          <Row gap="md">
            <Card elevated style={{ flex: 1 }}>
              <Column gap="sm">
                <Caption>Due Today</Caption>
                <Heading3
                  style={{
                    color: totalDueCards > 0 ? '$primary' : '$textSecondary',
                  }}
                >
                  {totalDueCards}
                </Heading3>
                <Body>
                  {totalDueCards === 0
                    ? 'All caught up! 🎉'
                    : 'cards to review'}
                </Body>
              </Column>
            </Card>

            <Card elevated style={{ flex: 1 }}>
              <Column gap="sm">
                <Caption>Total Decks</Caption>
                <Heading3>{totalDecks}</Heading3>
                <Body>{totalDecks === 0 ? 'No decks yet' : 'collections'}</Body>
              </Column>
            </Card>
          </Row>

          {/* Quick actions */}
          <Card elevated>
            <Column gap="lg">
              <Heading3>Quick Actions</Heading3>

              {totalDueCards > 0 ? (
                <Button onPress={onStartStudy} fullWidth size="lg">
                  <ButtonText size="lg">
                    📚 Start Studying ({totalDueCards} cards)
                  </ButtonText>
                </Button>
              ) : (
                <Column gap="md">
                  <Body style={{ textAlign: 'center', color: '$textSecondary' }}>
                    No cards due right now.
                    {'\n'}
                    Check back later or add more cards!
                  </Body>
                </Column>
              )}

              <Button onPress={onViewDecks} fullWidth variant="secondary">
                <ButtonText variant="secondary">📖 View All Decks</ButtonText>
              </Button>

              {onViewStatistics && (
                <Button onPress={onViewStatistics} fullWidth variant="secondary">
                  <ButtonText variant="secondary">📊 View Statistics</ButtonText>
                </Button>
              )}
            </Column>
          </Card>

          {/* Learning tips */}
          <Card style={{ backgroundColor: '$surfaceVariant' }}>
            <Column gap="md">
              <Row gap="sm">
                <Caption>💡 Tip</Caption>
              </Row>
              <Body>
                Consistency is key! Try to review your cards every day for
                optimal retention. The FSRS algorithm will adapt to your
                learning pace.
              </Body>
            </Column>
          </Card>

          {/* About section */}
          <Column gap="md" style={{ alignItems: 'center', marginTop: '$xl' }}>
            <Caption>Powered by FSRS Algorithm</Caption>
            <Body
              style={{
                textAlign: 'center',
                color: '$textSecondary',
                maxWidth: 600,
              }}
            >
              Iterate uses the Free Spaced Repetition Scheduler (FSRS) to
              optimize your learning. Review cards at the perfect time to
              maximize retention.
            </Body>
          </Column>
        </Column>
      </Container>
    </Screen>
  )
}
