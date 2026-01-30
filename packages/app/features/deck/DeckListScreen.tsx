import React, { useState, useMemo } from 'react'
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
import { Input } from 'tamagui'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDueOnly, setFilterDueOnly] = useState(false)

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

  // Filter and search decks
  const filteredDecks = useMemo(() => {
    if (!decks) return []
    
    let result = decks
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((deck) => 
        deck.name.toLowerCase().includes(query) ||
        deck.description?.toLowerCase().includes(query)
      )
    }
    
    // Apply due filter
    if (filterDueOnly) {
      result = result.filter((deck) => {
        const stats = deckStats[deck.id]
        return stats && stats.due > 0
      })
    }
    
    return result
  }, [decks, searchQuery, filterDueOnly, deckStats])

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

          {/* Search and Filter */}
          <Column gap="md">
            <Input
              placeholder="Search decks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                padding: 12,
                backgroundColor: '$surface',
                borderColor: '$border',
                borderWidth: 1,
                borderRadius: 8,
                fontSize: 16,
              }}
            />
            
            <Row gap="sm">
              <Button
                variant={filterDueOnly ? 'primary' : 'secondary'}
                onPress={() => setFilterDueOnly(!filterDueOnly)}
              >
                <ButtonText variant={filterDueOnly ? 'primary' : 'secondary'}>
                  {filterDueOnly ? '✓ ' : ''}Due Today
                </ButtonText>
              </Button>
              {(searchQuery || filterDueOnly) && (
                <Button
                  variant="ghost"
                  onPress={() => {
                    setSearchQuery('')
                    setFilterDueOnly(false)
                  }}
                >
                  <ButtonText variant="ghost">Clear Filters</ButtonText>
                </Button>
              )}
            </Row>
          </Column>

          {/* Deck grid */}
          {filteredDecks.length === 0 ? (
            <Column gap="md" style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Body style={{ textAlign: 'center', color: '$textSecondary' }}>
                No decks found matching your filters.
              </Body>
              {(searchQuery || filterDueOnly) && (
                <Button
                  variant="secondary"
                  onPress={() => {
                    setSearchQuery('')
                    setFilterDueOnly(false)
                  }}
                >
                  <ButtonText variant="secondary">Clear Filters</ButtonText>
                </Button>
              )}
            </Column>
          ) : (
            <Column gap="md">
              {filteredDecks.map((deck) => {
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
          )}
        </Column>
      </Container>
    </Screen>
  )
}
