import React, { useState } from 'react'
import { useAtomValue } from 'jotai'
import {
  Screen,
  Container,
  Column,
  Row,
  Heading2,
  Body,
  DeckCard,
  DeckTitle,
  DeckDescription,
  DeckStats,
  DeckStat,
  DeckStatLabel,
  DeckStatValue,
  Button,
  ButtonText,
  Caption,
} from 'ui'
import { useDecks, useCardRepository } from '../../store'

interface DeckListScreenProps {
  onDeckSelect?: (deckId: string) => void
  onCreateDeck?: () => void
}

export function DeckListScreen({
  onDeckSelect,
  onCreateDeck,
}: DeckListScreenProps) {
  const decks = useDecks()
  const cardRepo = useCardRepository()
  const [deckStats, setDeckStats] = useState<
    Record<string, { total: number; due: number }>
  >({})

  // Load stats for each deck
  React.useEffect(() => {
    async function loadStats() {
      if (!decks) return

      const stats: Record<string, { total: number; due: number }> = {}

      for (const deck of decks) {
        const total = await cardRepo.getCardCount(deck.id)
        const dueCards = await cardRepo.getDueCards(new Date(), deck.id)
        stats[deck.id] = { total, due: dueCards.length }
      }

      setDeckStats(stats)
    }

    loadStats()
  }, [decks, cardRepo])

  if (!decks) {
    return (
      <Screen centered>
        <Body>Loading decks...</Body>
      </Screen>
    )
  }

  if (decks.length === 0) {
    return (
      <Screen centered>
        <Container>
          <Column gap="lg">
            <Heading2 centered>Welcome to Iterate! 🦊</Heading2>
            <Body style={{ textAlign: 'center' }}>
              Create your first deck to start learning.
              {'\n'}
              Organize your flashcards by topic for focused study sessions.
            </Body>
            <Button onPress={onCreateDeck} fullWidth>
              <ButtonText>Create Your First Deck</ButtonText>
            </Button>
          </Column>
        </Container>
      </Screen>
    )
  }

  return (
    <Screen>
      <Container>
        <Column gap="xl">
          {/* Header */}
          <Row justify="between">
            <Heading2>My Decks</Heading2>
            <Button onPress={onCreateDeck}>
              <ButtonText>+ New Deck</ButtonText>
            </Button>
          </Row>

          {/* Deck grid */}
          <Column gap="md">
            {decks.map((deck) => {
              const stats = deckStats[deck.id] || { total: 0, due: 0 }

              return (
                <DeckCard
                  key={deck.id}
                  onPress={() => onDeckSelect?.(deck.id)}
                >
                  <Column gap="sm">
                    <DeckTitle>{deck.name}</DeckTitle>

                    {deck.description && (
                      <DeckDescription>{deck.description}</DeckDescription>
                    )}

                    <DeckStats>
                      <DeckStat>
                        <DeckStatValue>{stats.total}</DeckStatValue>
                        <DeckStatLabel>Total Cards</DeckStatLabel>
                      </DeckStat>

                      <DeckStat>
                        <DeckStatValue
                          style={{
                            color:
                              stats.due > 0 ? '$primary' : '$textSecondary',
                          }}
                        >
                          {stats.due}
                        </DeckStatValue>
                        <DeckStatLabel>Due Today</DeckStatLabel>
                      </DeckStat>
                    </DeckStats>

                    <Row justify="between" marginTop="$sm">
                      <Caption>
                        Created {deck.created.toLocaleDateString()}
                      </Caption>
                      {stats.due > 0 && (
                        <Caption style={{ color: '$primary', fontWeight: '700' }}>
                          Ready to study! 📚
                        </Caption>
                      )}
                    </Row>
                  </Column>
                </DeckCard>
              )
            })}
          </Column>
        </Column>
      </Container>
    </Screen>
  )
}
