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
import { Input } from 'tamagui'
import { useDeckRepository } from '../../store'
import { Deck } from '../../domain/model'

interface AddDeckScreenProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function AddDeckScreen({ onComplete, onCancel }: AddDeckScreenProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deckRepo = useDeckRepository()

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Deck name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const now = new Date()
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim() || undefined,
        created: now,
        modified: now,
      }

      await deckRepo.saveDeck(newDeck)
      onComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deck')
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
            <Heading3>Create New Deck</Heading3>
            {onCancel && (
              <Button variant="ghost" onPress={onCancel}>
                <ButtonText variant="ghost">Cancel</ButtonText>
              </Button>
            )}
          </Row>

          {/* Form */}
          <Card elevated>
            <Column gap="lg">
              {/* Name field */}
              <Column gap="sm">
                <Label>Deck Name *</Label>
                <Input
                  placeholder="e.g., Spanish Vocabulary, Chemistry Formulas"
                  value={name}
                  onChangeText={setName}
                  style={{
                    padding: 12,
                    backgroundColor: '$surface',
                    borderColor: '$border',
                    borderWidth: 1,
                    borderRadius: 8,
                    fontSize: 16,
                  }}
                />
              </Column>

              {/* Description field */}
              <Column gap="sm">
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Brief description of this deck"
                  value={description}
                  onChangeText={setDescription}
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

              {/* Submit buttons */}
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
                    {isSubmitting ? 'Creating...' : 'Create Deck'}
                  </ButtonText>
                </Button>
              </Row>
            </Column>
          </Card>

          {/* Info */}
          <Card style={{ backgroundColor: '$surfaceVariant' }}>
            <Column gap="md">
              <Body style={{ fontWeight: '600' }}>📚 About Decks</Body>
              <Body style={{ fontSize: 14, lineHeight: 20 }}>
                Decks help you organize your flashcards by topic. Create
                separate decks for different subjects or learning goals.
              </Body>
            </Column>
          </Card>
        </Column>
      </Container>
    </Screen>
  )
}
