import React, { useState } from 'react'
import {
  Screen,
  Container,
  Column,
  Row,
  Heading3,
  Body,
  Label,
  Button,
  ButtonText,
  Card,
} from 'ui'
import { Stack, Input, TextArea } from 'tamagui'
import { useCardRepository, useDeckRepository } from '../../store'
import { Card as CardModel, CardState } from '../../domain/model'

interface AddCardScreenProps {
  deckId?: string
  onComplete?: () => void
  onCancel?: () => void
}

export function AddCardScreen({
  deckId,
  onComplete,
  onCancel,
}: AddCardScreenProps) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [selectedDeckId, setSelectedDeckId] = useState(deckId || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cardRepo = useCardRepository()
  const deckRepo = useDeckRepository()

  const handleSubmit = async () => {
    if (!front.trim()) {
      setError('Front of card is required')
      return
    }
    if (!back.trim()) {
      setError('Back of card is required')
      return
    }
    if (!selectedDeckId) {
      setError('Please select a deck')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const now = new Date()
      const newCard: CardModel = {
        id: crypto.randomUUID(),
        deckId: selectedDeckId,
        front: front.trim(),
        back: back.trim(),
        created: now,
        modified: now,
        due: now,
        stability: 1,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: CardState.New,
      }

      await cardRepo.saveCard(newCard)
      onComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <Container>
        <Column gap="xl">
          {/* Header */}
          <Row justify="between">
            <Heading3>Add New Card</Heading3>
            {onCancel && (
              <Button variant="ghost" onPress={onCancel}>
                <ButtonText variant="ghost">Cancel</ButtonText>
              </Button>
            )}
          </Row>

          {/* Form */}
          <Card elevated>
            <Column gap="lg">
              {/* Front field */}
              <Column gap="sm">
                <Label>Front (Question)</Label>
                <Input
                  placeholder="Enter the question or prompt"
                  value={front}
                  onChangeText={setFront}
                  multiline
                  numberOfLines={3}
                  style={{
                    minHeight: 80,
                    padding: 12,
                    backgroundColor: '$surface',
                    borderColor: '$border',
                    borderWidth: 1,
                    borderRadius: 8,
                    fontSize: 16,
                  }}
                />
              </Column>

              {/* Back field */}
              <Column gap="sm">
                <Label>Back (Answer)</Label>
                <Input
                  placeholder="Enter the answer"
                  value={back}
                  onChangeText={setBack}
                  multiline
                  numberOfLines={3}
                  style={{
                    minHeight: 80,
                    padding: 12,
                    backgroundColor: '$surface',
                    borderColor: '$border',
                    borderWidth: 1,
                    borderRadius: 8,
                    fontSize: 16,
                  }}
                />
              </Column>

              {/* Error message */}
              {error && (
                <Body style={{ color: '$error', textAlign: 'center' }}>
                  {error}
                </Body>
              )}

              {/* Submit button */}
              <Row gap="md">
                {onCancel && (
                  <Button
                    variant="secondary"
                    onPress={onCancel}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    <ButtonText variant="secondary">Cancel</ButtonText>
                  </Button>
                )}
                <Button
                  onPress={handleSubmit}
                  fullWidth
                  disabled={isSubmitting}
                >
                  <ButtonText>
                    {isSubmitting ? 'Creating...' : 'Create Card'}
                  </ButtonText>
                </Button>
              </Row>
            </Column>
          </Card>

          {/* Tips */}
          <Card style={{ backgroundColor: '$surfaceVariant' }}>
            <Column gap="md">
              <Body style={{ fontWeight: '600' }}>💡 Tips for Great Cards</Body>
              <Body style={{ fontSize: 14, lineHeight: 20 }}>
                • Keep questions clear and specific{'\n'}
                • Break complex topics into multiple cards{'\n'}
                • Use your own words to aid memory{'\n'}
                • Add context if needed{'\n'}
                • Use **bold**, *italic*, or `code` for emphasis
              </Body>
            </Column>
          </Card>
        </Column>
      </Container>
    </Screen>
  )
}
