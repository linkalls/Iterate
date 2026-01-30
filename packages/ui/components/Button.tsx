import { styled, Stack, Text } from 'tamagui'

/**
 * Button Component
 * Beautiful button with variants for different actions
 */
export const Button = styled(Stack, {
  paddingHorizontal: '$lg',
  paddingVertical: '$md',
  borderRadius: '$md',
  backgroundColor: '$primary',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  
  hoverStyle: {
    opacity: 0.9,
    scale: 1.02,
  },
  
  pressStyle: {
    scale: 0.98,
  },
  
  focusStyle: {
    borderWidth: 2,
    borderColor: '$primaryVariant',
  },
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      secondary: {
        backgroundColor: '$surface',
        borderWidth: 1,
        borderColor: '$border',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      error: {
        backgroundColor: '$error',
      },
      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$surfaceVariant',
        },
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$sm',
        paddingVertical: '$xs',
      },
      md: {
        paddingHorizontal: '$lg',
        paddingVertical: '$md',
      },
      lg: {
        paddingHorizontal: '$xl',
        paddingVertical: '$lg',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        hoverStyle: {
          opacity: 0.5,
          scale: 1,
        },
        pressStyle: {
          scale: 1,
        },
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const ButtonText = styled(Text, {
  color: '$background',
  fontSize: 16,
  fontWeight: '600',
  
  variants: {
    variant: {
      secondary: {
        color: '$text',
      },
      ghost: {
        color: '$text',
      },
    },
    size: {
      sm: {
        fontSize: 14,
      },
      md: {
        fontSize: 16,
      },
      lg: {
        fontSize: 18,
      },
    },
  } as const,
})

/**
 * Rating Buttons for FSRS
 * Specialized buttons for card rating
 */
export const RatingButton = styled(Button, {
  flex: 1,
  minWidth: 80,
  
  variants: {
    rating: {
      again: {
        backgroundColor: '$error',
      },
      hard: {
        backgroundColor: '$warning',
      },
      good: {
        backgroundColor: '$success',
      },
      easy: {
        backgroundColor: '$primary',
      },
    },
  } as const,
})
