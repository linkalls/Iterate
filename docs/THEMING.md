# Theme System Guide

Iterate features a beautiful, fully-customizable theme system with light and dark modes.

## Features

- 🎨 **Beautiful color palettes** - Carefully chosen colors for optimal readability
- 🌓 **Dark & Light modes** - Eye-friendly themes for day and night
- 💾 **Persistent preference** - Your choice is saved across sessions
- ⚡ **Instant switching** - No page reload required
- 🎯 **Consistent design** - All components follow the same theme

## Color System

### Light Theme

Designed for daytime use with high contrast and clarity:

- **Background**: Clean white (#FFFFFF)
- **Surface**: Subtle gray (#F8F9FA)
- **Primary**: Vibrant indigo (#6366F1)
- **Text**: Dark slate (#1F2937)
- **Accents**: Success (green), Warning (amber), Error (red)

### Dark Theme

Eye-friendly for low-light environments:

- **Background**: Deep slate (#0F172A)
- **Surface**: Medium slate (#1E293B)
- **Primary**: Lighter indigo (#818CF8)
- **Text**: Light slate (#F1F5F9)
- **Accents**: Brighter variants for visibility

## Usage

### In React Components

```typescript
import { useAtom } from 'jotai'
import { themeAtom, toggleThemeAtom } from 'app/store'

function MyComponent() {
  const [theme, toggleTheme] = useAtom(toggleThemeAtom)
  
  return (
    <Button onPress={() => toggleTheme()}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </Button>
  )
}
```

### With Tamagui Provider

```typescript
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from 'ui'
import { useAtomValue } from 'jotai'
import { themeAtom } from 'app/store'

function App() {
  const theme = useAtomValue(themeAtom)
  
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <YourApp />
    </TamaguiProvider>
  )
}
```

### Accessing Theme Colors

Tamagui components automatically use theme colors:

```typescript
import { Stack, Text } from 'tamagui'

function Card() {
  return (
    <Stack backgroundColor="$surface" borderColor="$border">
      <Text color="$text">This text adapts to the theme</Text>
      <Text color="$textSecondary">Secondary text color</Text>
    </Stack>
  )
}
```

## Theme Tokens

### Colors

Available color tokens:

- `$background` - Main background color
- `$surface` - Card and surface backgrounds
- `$surfaceVariant` - Alternate surface color
- `$primary` - Primary brand color
- `$primaryVariant` - Darker/lighter primary
- `$secondary` - Secondary accent
- `$text` - Primary text color
- `$textSecondary` - Secondary text color
- `$border` - Border and divider color
- `$success` - Success states
- `$warning` - Warning states
- `$error` - Error states
- `$cardBackground` - Card backgrounds
- `$cardShadow` - Card shadow color

### Spacing

Consistent spacing scale:

- `$xs` - 4px
- `$sm` - 8px
- `$md` - 16px
- `$lg` - 24px
- `$xl` - 32px
- `$2xl` - 48px
- `$3xl` - 64px

### Radius

Border radius tokens:

- `$xs` - 4px - Small elements
- `$sm` - 8px - Buttons, inputs
- `$md` - 12px - Cards
- `$lg` - 16px - Large cards
- `$xl` - 24px - Extra large
- `$full` - 9999px - Fully rounded

## Customization

### Modifying Colors

Edit `packages/ui/tamagui.config.ts`:

```typescript
const tokens = createTokens({
  color: {
    // Add your custom colors
    customPrimary: '#YOUR_COLOR',
    customSecondary: '#YOUR_COLOR',
  }
})

const lightTheme = {
  primary: tokens.color.customPrimary,
  // ... other colors
}
```

### Creating New Themes

You can create additional theme variants:

```typescript
const blueTheme = {
  background: '#001F3F',
  primary: '#0074D9',
  // ... other colors
}

export const config = createTamagui({
  themes: {
    light: lightTheme,
    dark: darkTheme,
    blue: blueTheme, // New theme!
  }
})
```

## Best Practices

### 1. Always Use Theme Tokens

❌ **Don't:**
```typescript
<Stack backgroundColor="#6366F1">
```

✅ **Do:**
```typescript
<Stack backgroundColor="$primary">
```

### 2. Respect User Preference

The theme switcher saves the user's preference. Don't override it without reason.

### 3. Test Both Themes

Always test your UI in both light and dark modes to ensure good contrast and readability.

### 4. Use Semantic Colors

Choose colors based on meaning:

- `$primary` for main actions
- `$success` for positive outcomes
- `$error` for problems
- `$textSecondary` for less important text

## Design Principles

### Contrast

Both themes maintain WCAG AA contrast ratios:

- Text on background: ≥4.5:1
- Large text: ≥3:1
- UI components: ≥3:1

### Consistency

All components follow the same color system:

- Cards use `$surface`
- Borders use `$border`
- Buttons use `$primary`

### Accessibility

- High contrast ratios
- Clear visual hierarchy
- Consistent spacing
- Readable font sizes

## Examples

### Theme-Aware Card

```typescript
import { Card, Heading3, Body } from 'ui'

function StatsCard({ title, value }) {
  return (
    <Card elevated>
      <Heading3>{value}</Heading3>
      <Body>{title}</Body>
    </Card>
  )
}
```

The card automatically adapts:
- Light mode: White background, dark text
- Dark mode: Slate background, light text

### Custom Theme Component

```typescript
import { Stack, Text, useTheme } from 'tamagui'

function CustomComponent() {
  const theme = useTheme()
  
  return (
    <Stack
      backgroundColor={theme.surface.val}
      borderColor={theme.border.val}
      borderWidth={1}
      borderRadius="$md"
      padding="$lg"
    >
      <Text color={theme.text.val}>
        This uses theme values directly
      </Text>
    </Stack>
  )
}
```

### Conditional Styling

```typescript
import { useAtomValue } from 'jotai'
import { themeAtom } from 'app/store'

function ConditionalComponent() {
  const theme = useAtomValue(themeAtom)
  const isDark = theme === 'dark'
  
  return (
    <Stack>
      <Text>Current theme: {theme}</Text>
      {isDark && <Text>🌙 Dark mode active</Text>}
    </Stack>
  )
}
```

## System Preference Detection

Automatically detect system theme preference:

```typescript
import { useColorScheme } from 'react-native'
import { useSetAtom } from 'jotai'
import { themeAtom } from 'app/store'

function useSystemTheme() {
  const colorScheme = useColorScheme()
  const setTheme = useSetAtom(themeAtom)
  
  React.useEffect(() => {
    // Only set if user hasn't manually chosen
    const userPreference = localStorage.getItem('iterate-theme')
    if (!userPreference && colorScheme) {
      setTheme(colorScheme)
    }
  }, [colorScheme])
}
```

## Animation

Theme transitions are instant, but you can add animations:

```typescript
import { Stack } from 'tamagui'

function AnimatedCard() {
  return (
    <Stack
      backgroundColor="$surface"
      animation="quick"
      // Animates when theme changes
    >
      <Text>Smooth transition</Text>
    </Stack>
  )
}
```

## Debugging

### View Current Theme

```typescript
import { useAtomValue } from 'jotai'
import { themeAtom } from 'app/store'

function DebugTheme() {
  const theme = useAtomValue(themeAtom)
  console.log('Current theme:', theme)
  
  return <Text>Theme: {theme}</Text>
}
```

### Check Token Values

```typescript
import { useTheme } from 'tamagui'

function DebugTokens() {
  const theme = useTheme()
  
  console.log('Primary color:', theme.primary.val)
  console.log('Background:', theme.background.val)
  
  return null
}
```

## Resources

- [Tamagui Documentation](https://tamagui.dev)
- [Design Tokens](https://tamagui.dev/docs/core/tokens)
- [Theme Creation](https://tamagui.dev/docs/core/theme)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
