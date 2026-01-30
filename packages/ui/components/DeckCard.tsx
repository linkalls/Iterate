import { styled, Stack, Text } from 'tamagui'

/**
 * DeckCard Component
 * Card component for displaying deck information in a grid/list
 */
export const DeckCard = styled(Stack, {
  borderRadius: '$md',
  padding: '$lg',
  backgroundColor: '$surface',
  borderWidth: 1,
  borderColor: '$border',
  cursor: 'pointer',
  
  hoverStyle: {
    borderColor: '$primary',
    backgroundColor: '$surfaceVariant',
    transform: [{ translateY: -2 }],
  },
  
  pressStyle: {
    scale: 0.98,
  },
  
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
        borderWidth: 2,
        backgroundColor: '$surfaceVariant',
      },
    },
  } as const,
})

export const DeckTitle = styled(Text, {
  fontSize: 20,
  fontWeight: '600',
  color: '$text',
  marginBottom: '$xs',
})

export const DeckDescription = styled(Text, {
  fontSize: 14,
  color: '$textSecondary',
  marginBottom: '$md',
  lineHeight: 20,
})

export const DeckStats = styled(Stack, {
  flexDirection: 'row',
  gap: '$md',
  marginTop: '$sm',
})

export const DeckStat = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$xs',
})

export const DeckStatLabel = styled(Text, {
  fontSize: 12,
  color: '$textSecondary',
})

export const DeckStatValue = styled(Text, {
  fontSize: 16,
  fontWeight: '700',
  color: '$text',
})
