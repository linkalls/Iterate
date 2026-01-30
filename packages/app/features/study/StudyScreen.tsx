import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import {
  Screen,
  Container,
  CardContainer,
  CardLabel,
  CardText,
  CardDivider,
  Button,
  ButtonText,
  RatingButton,
  Row,
  Column,
  Heading3,
  Body,
  Caption,
} from 'ui'
import {
  useDeckDueCards,
  useCurrentCardIndex,
  useShowAnswer,
  useSessionComplete,
  useResetStudySession,
} from '../../store'
import { Rating } from '../../domain/model'

interface StudyScreenProps {
  deckId: string
  onComplete?: () => void
}

export function StudyScreen({ deckId, onComplete }: StudyScreenProps) {
  const dueCards = useDeckDueCards()
  const [currentIndex, setCurrentIndex] = useCurrentCardIndex()
  const [showAnswer, setShowAnswer] = useShowAnswer()
  const [sessionComplete, setSessionComplete] = useSessionComplete()
  const resetSession = useResetStudySession()

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleRating = async (rating: Rating) => {
    // TODO: Integrate ts-fsrs to update card
    // For now, just move to next card
    
    const nextIndex = currentIndex + 1
    if (nextIndex >= dueCards.length) {
      setSessionComplete(true)
    } else {
      setCurrentIndex(nextIndex)
      setShowAnswer(false)
    }
  }

  const handleRestart = () => {
    resetSession()
    onComplete?.()
  }

  // Loading state
  if (!dueCards) {
    return (
      <Screen centered>
        <Body>Loading cards...</Body>
      </Screen>
    )
  }

  // No cards to review
  if (dueCards.length === 0) {
    return (
      <Screen centered>
        <Container>
          <Column gap="lg">
            <Heading3 centered>🎉 All Done!</Heading3>
            <Body style={{ textAlign: 'center' }}>
              No cards due for review right now.
              {'\n'}
              Great job staying on top of your studies!
            </Body>
            <Button onPress={onComplete} fullWidth>
              <ButtonText>Back to Decks</ButtonText>
            </Button>
          </Column>
        </Container>
      </Screen>
    )
  }

  // Session complete
  if (sessionComplete || currentIndex >= dueCards.length) {
    return (
      <Screen centered>
        <Container>
          <Column gap="lg">
            <Heading3 centered>🎊 Session Complete!</Heading3>
            <Body style={{ textAlign: 'center' }}>
              You reviewed {dueCards.length} card{dueCards.length !== 1 ? 's' : ''}.
              {'\n'}
              Keep up the excellent work!
            </Body>
            <Row gap="md">
              <Button onPress={handleRestart} fullWidth variant="secondary">
                <ButtonText variant="secondary">Study Again</ButtonText>
              </Button>
              <Button onPress={onComplete} fullWidth>
                <ButtonText>Back to Decks</ButtonText>
              </Button>
            </Row>
          </Column>
        </Container>
      </Screen>
    )
  }

  const currentCard = dueCards[currentIndex]
  const progress = ((currentIndex + 1) / dueCards.length) * 100

  return (
    <Screen>
      <Container>
        <Column gap="lg">
          {/* Progress indicator */}
          <Column gap="xs">
            <Row justify="between">
              <Caption>
                Card {currentIndex + 1} of {dueCards.length}
              </Caption>
              <Caption>{Math.round(progress)}% Complete</Caption>
            </Row>
            <Stack
              height={4}
              backgroundColor="$surfaceVariant"
              borderRadius="$full"
              overflow="hidden"
            >
              <Stack
                height="100%"
                width={`${progress}%`}
                backgroundColor="$primary"
                borderRadius="$full"
              />
            </Stack>
          </Column>

          {/* Flashcard */}
          <CardContainer>
            <Column gap="lg" width="100%">
              {/* Front of card */}
              <Column gap="sm">
                <CardLabel>Question</CardLabel>
                <CardText type="question">{currentCard.front}</CardText>
              </Column>

              {/* Answer (shown after reveal) */}
              {showAnswer && (
                <>
                  <CardDivider />
                  <Column gap="sm">
                    <CardLabel>Answer</CardLabel>
                    <CardText type="answer">{currentCard.back}</CardText>
                  </Column>
                </>
              )}
            </Column>
          </CardContainer>

          {/* Action buttons */}
          {!showAnswer ? (
            <Button onPress={handleShowAnswer} fullWidth size="lg">
              <ButtonText size="lg">Show Answer</ButtonText>
            </Button>
          ) : (
            <Column gap="md">
              <Caption style={{ textAlign: 'center' }}>
                How well did you know this?
              </Caption>
              <Row gap="md">
                <RatingButton
                  rating="again"
                  onPress={() => handleRating(Rating.Again)}
                >
                  <ButtonText size="sm">Again</ButtonText>
                </RatingButton>
                <RatingButton
                  rating="hard"
                  onPress={() => handleRating(Rating.Hard)}
                >
                  <ButtonText size="sm">Hard</ButtonText>
                </RatingButton>
                <RatingButton
                  rating="good"
                  onPress={() => handleRating(Rating.Good)}
                >
                  <ButtonText size="sm">Good</ButtonText>
                </RatingButton>
                <RatingButton
                  rating="easy"
                  onPress={() => handleRating(Rating.Easy)}
                >
                  <ButtonText size="sm">Easy</ButtonText>
                </RatingButton>
              </Row>
            </Column>
          )}

          {/* Card metadata */}
          <Row justify="between">
            <Caption>
              Reviewed {currentCard.reps} time{currentCard.reps !== 1 ? 's' : ''}
            </Caption>
            {currentCard.last_review && (
              <Caption>
                Last: {new Date(currentCard.last_review).toLocaleDateString()}
              </Caption>
            )}
          </Row>
        </Column>
      </Container>
    </Screen>
  )
}

// Import Stack for progress bar
import { Stack } from 'tamagui'
