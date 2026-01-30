import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Stack } from 'tamagui'
import { Platform } from 'react-native'
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
  MarkdownText,
} from 'ui'
import {
  useDeckDueCards,
  useCurrentCardIndex,
  useShowAnswer,
  useSessionComplete,
  useResetStudySession,
  useCardRepository,
} from '../../store'
import { Rating } from '../../domain/model'
import { fsrsService } from '../../services'

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
  const cardRepo = useCardRepository()
  const [schedulingInfo, setSchedulingInfo] = React.useState<any>(null)

  // Calculate scheduling info when answer is shown
  React.useEffect(() => {
    if (showAnswer && dueCards && dueCards.length > 0 && currentIndex < dueCards.length) {
      const currentCard = dueCards[currentIndex]
      const info = fsrsService.getSchedulingInfo(currentCard)
      setSchedulingInfo(info)
    }
  }, [showAnswer, currentIndex, dueCards])

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleRating = async (rating: Rating) => {
    if (!dueCards || currentIndex >= dueCards.length) return
    
    const currentCard = dueCards[currentIndex]
    
    try {
      // Use FSRS to calculate the updated card
      const updatedCard = fsrsService.reviewCard(currentCard, rating)
      
      // Save the updated card to the repository
      await cardRepo.saveCard(updatedCard)
      
      // Move to next card
      const nextIndex = currentIndex + 1
      if (nextIndex >= dueCards.length) {
        setSessionComplete(true)
      } else {
        setCurrentIndex(nextIndex)
        setShowAnswer(false)
        setSchedulingInfo(null)
      }
    } catch (error) {
      console.error('Error updating card:', error)
      // Still move to next card even if save fails
      const nextIndex = currentIndex + 1
      if (nextIndex >= dueCards.length) {
        setSessionComplete(true)
      } else {
        setCurrentIndex(nextIndex)
        setShowAnswer(false)
        setSchedulingInfo(null)
      }
    }
  }

  const handleRestart = () => {
    resetSession()
    onComplete?.()
  }

  // Keyboard shortcuts (web only)
  React.useEffect(() => {
    // Only enable keyboard shortcuts on web
    if (Platform.OS !== 'web') return

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if in session complete or no cards
      if (sessionComplete || !dueCards || currentIndex >= dueCards.length) return

      // Show answer with Space or Enter
      if (!showAnswer && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault()
        handleShowAnswer()
        return
      }

      // Rate card with number keys (1-4)
      if (showAnswer) {
        switch (event.key) {
          case '1':
            event.preventDefault()
            handleRating(Rating.Again)
            break
          case '2':
            event.preventDefault()
            handleRating(Rating.Hard)
            break
          case '3':
            event.preventDefault()
            handleRating(Rating.Good)
            break
          case '4':
            event.preventDefault()
            handleRating(Rating.Easy)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAnswer, sessionComplete, currentIndex, dueCards])

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
                <MarkdownText style={{ fontSize: 18, lineHeight: 26 }}>
                  {currentCard.front}
                </MarkdownText>
              </Column>

              {/* Answer (shown after reveal) */}
              {showAnswer && (
                <>
                  <CardDivider />
                  <Column gap="sm">
                    <CardLabel>Answer</CardLabel>
                    <MarkdownText style={{ fontSize: 18, lineHeight: 26 }}>
                      {currentCard.back}
                    </MarkdownText>
                  </Column>
                </>
              )}
            </Column>
          </CardContainer>

          {/* Action buttons */}
          {!showAnswer ? (
            <Column gap="sm">
              <Button onPress={handleShowAnswer} fullWidth size="lg">
                <ButtonText size="lg">Show Answer</ButtonText>
              </Button>
              {Platform.OS === 'web' && (
                <Caption style={{ textAlign: 'center', color: '$textSecondary' }}>
                  Press Space or Enter
                </Caption>
              )}
            </Column>
          ) : (
            <Column gap="md">
              <Caption style={{ textAlign: 'center' }}>
                How well did you know this?
              </Caption>
              {Platform.OS === 'web' && (
                <Caption style={{ textAlign: 'center', color: '$textSecondary', fontSize: 12 }}>
                  Use keys 1-4 for quick rating
                </Caption>
              )}
              <Row gap="md">
                <RatingButton
                  rating="again"
                  onPress={() => handleRating(Rating.Again)}
                >
                  <Column gap="xs" style={{ alignItems: 'center' }}>
                    <ButtonText size="sm">Again</ButtonText>
                    {schedulingInfo && (
                      <Caption style={{ fontSize: 10 }}>
                        {schedulingInfo.again.interval}
                      </Caption>
                    )}
                    {Platform.OS === 'web' && (
                      <Caption style={{ fontSize: 9, opacity: 0.6 }}>1</Caption>
                    )}
                  </Column>
                </RatingButton>
                <RatingButton
                  rating="hard"
                  onPress={() => handleRating(Rating.Hard)}
                >
                  <Column gap="xs" style={{ alignItems: 'center' }}>
                    <ButtonText size="sm">Hard</ButtonText>
                    {schedulingInfo && (
                      <Caption style={{ fontSize: 10 }}>
                        {schedulingInfo.hard.interval}
                      </Caption>
                    )}
                    {Platform.OS === 'web' && (
                      <Caption style={{ fontSize: 9, opacity: 0.6 }}>2</Caption>
                    )}
                  </Column>
                </RatingButton>
                <RatingButton
                  rating="good"
                  onPress={() => handleRating(Rating.Good)}
                >
                  <Column gap="xs" style={{ alignItems: 'center' }}>
                    <ButtonText size="sm">Good</ButtonText>
                    {schedulingInfo && (
                      <Caption style={{ fontSize: 10 }}>
                        {schedulingInfo.good.interval}
                      </Caption>
                    )}
                    {Platform.OS === 'web' && (
                      <Caption style={{ fontSize: 9, opacity: 0.6 }}>3</Caption>
                    )}
                  </Column>
                </RatingButton>
                <RatingButton
                  rating="easy"
                  onPress={() => handleRating(Rating.Easy)}
                >
                  <Column gap="xs" style={{ alignItems: 'center' }}>
                    <ButtonText size="sm">Easy</ButtonText>
                    {schedulingInfo && (
                      <Caption style={{ fontSize: 10 }}>
                        {schedulingInfo.easy.interval}
                      </Caption>
                    )}
                    {Platform.OS === 'web' && (
                      <Caption style={{ fontSize: 9, opacity: 0.6 }}>4</Caption>
                    )}
                  </Column>
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
