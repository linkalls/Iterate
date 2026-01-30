import React, { useState, useEffect } from 'react'
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

interface EditDeckScreenProps {
  deckId: string
  onComplete?: () => void
  onCancel?: () => void
}

export function EditDeckScreen({
  deckId,
  onComplete,
  onCancel,
}: EditDeckScreenProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deckRepo = useDeckRepository()

  useEffect(() => {
    loadDeck()
  }, [deckId])

  const loadDeck = async () => {
    try {
      const deck = await deckRepo.getDeck(deckId)
      if (deck) {
        setName(deck.name)
        setDescription(deck.description || '')
      } else {
        setError('Deck not found')
      }
    } catch (err) {
      setError('Failed to load deck')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Deck name is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const deck = await deckRepo.getDeck(deckId)
      if (!deck) {
        throw new Error('Deck not found')
      }

      const updatedDeck: Deck = {
        ...deck,
        name: name.trim(),
        description: description.trim() || undefined,
        modified: new Date(),
      }

      await deckRepo.saveDeck(updatedDeck)
      onComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deck')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Screen centered>
        <Body>Loading deck...</Body>
      </Screen>
    )
  }

  return (
    <Screen>
      <Container>
        <Column gap="xl">
          {/* Header */}
          <Row justify="between">
            <Heading3>Edit Deck</Heading3>
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
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </ButtonText>
                </Button>
              </Row>
            </Column>
          </Card>
        </Column>
      </Container>
    </Screen>
  )
}
