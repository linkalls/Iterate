import { styled, Stack, Text } from 'tamagui'

/**
 * Container Components
 * Layout primitives for consistent spacing and structure
 */
export const Screen = styled(Stack, {
  flex: 1,
  backgroundColor: '$background',
  padding: '$lg',
  
  variants: {
    centered: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    noPadding: {
      true: {
        padding: 0,
      },
    },
  } as const,
})

export const Container = styled(Stack, {
  width: '100%',
  maxWidth: 1200,
  marginHorizontal: 'auto',
  padding: '$lg',
})

export const Card = styled(Stack, {
  backgroundColor: '$surface',
  borderRadius: '$md',
  padding: '$lg',
  borderWidth: 1,
  borderColor: '$border',
  
  variants: {
    elevated: {
      true: {
        shadowColor: '$cardShadow',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      },
    },
    noPadding: {
      true: {
        padding: 0,
      },
    },
  } as const,
})

export const Section = styled(Stack, {
  marginBottom: '$xl',
})

export const Row = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  
  variants: {
    gap: {
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
  } as const,
})

export const Column = styled(Stack, {
  flexDirection: 'column',
  
  variants: {
    gap: {
      sm: { gap: '$sm' },
      md: { gap: '$md' },
      lg: { gap: '$lg' },
    },
  } as const,
})
