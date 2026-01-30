import { Stack, Text, styled } from 'tamagui'

/**
 * FlashCard Component
 * Beautiful card component for displaying flashcards with flip animation
 */
export const CardContainer = styled(Stack, {
  minHeight: 400,
  borderRadius: '$lg',
  padding: '$xl',
  backgroundColor: '$cardBackground',
  shadowColor: '$cardShadow',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 4,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  
  variants: {
    size: {
      sm: {
        minHeight: 300,
        padding: '$lg',
      },
      md: {
        minHeight: 400,
        padding: '$xl',
      },
      lg: {
        minHeight: 500,
        padding: '$2xl',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
  },
})

export const CardText = styled(Text, {
  fontSize: 24,
  lineHeight: 32,
  color: '$text',
  textAlign: 'center',
  fontWeight: '500',
  
  variants: {
    type: {
      question: {
        fontSize: 28,
        fontWeight: '600',
        color: '$text',
      },
      answer: {
        fontSize: 22,
        color: '$textSecondary',
      },
    },
  } as const,
})

export const CardLabel = styled(Text, {
  fontSize: 12,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  color: '$textSecondary',
  marginBottom: '$sm',
})

export const CardDivider = styled(Stack, {
  width: '100%',
  height: 1,
  backgroundColor: '$border',
  marginVertical: '$lg',
  opacity: 0.5,
})
