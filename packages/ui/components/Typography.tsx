import { styled, Text } from 'tamagui'

/**
 * Typography Components
 * Consistent text styles throughout the app
 */
export const Heading1 = styled(Text, {
  fontSize: 48,
  fontWeight: '700',
  color: '$text',
  lineHeight: 56,
  letterSpacing: -1,
  
  variants: {
    centered: {
      true: {
        textAlign: 'center',
      },
    },
  } as const,
})

export const Heading2 = styled(Text, {
  fontSize: 36,
  fontWeight: '700',
  color: '$text',
  lineHeight: 44,
  letterSpacing: -0.5,
  
  variants: {
    centered: {
      true: {
        textAlign: 'center',
      },
    },
  } as const,
})

export const Heading3 = styled(Text, {
  fontSize: 28,
  fontWeight: '600',
  color: '$text',
  lineHeight: 36,
  
  variants: {
    centered: {
      true: {
        textAlign: 'center',
      },
    },
  } as const,
})

export const Heading4 = styled(Text, {
  fontSize: 22,
  fontWeight: '600',
  color: '$text',
  lineHeight: 30,
  
  variants: {
    centered: {
      true: {
        textAlign: 'center',
      },
    },
  } as const,
})

export const BodyLarge = styled(Text, {
  fontSize: 18,
  color: '$text',
  lineHeight: 28,
})

export const Body = styled(Text, {
  fontSize: 16,
  color: '$text',
  lineHeight: 24,
})

export const BodySmall = styled(Text, {
  fontSize: 14,
  color: '$textSecondary',
  lineHeight: 20,
})

export const Caption = styled(Text, {
  fontSize: 12,
  color: '$textSecondary',
  lineHeight: 16,
  textTransform: 'uppercase',
  letterSpacing: 1,
  fontWeight: '600',
})

export const Label = styled(Text, {
  fontSize: 14,
  fontWeight: '600',
  color: '$text',
  marginBottom: '$xs',
})
