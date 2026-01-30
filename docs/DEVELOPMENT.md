# Development Guide

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18 (for compatibility)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/linkalls/Iterate.git
cd Iterate

# Install dependencies
bun install
```

## Project Structure

This is a monorepo managed by Turborepo. The code is organized as follows:

```
iterate/
├── apps/               # Application entry points
│   ├── expo/          # React Native mobile app
│   └── next/          # Next.js web app
├── packages/
│   ├── app/           # Shared application logic
│   ├── ui/            # Shared UI components
│   └── db/            # Database utilities
└── docs/              # Documentation
```

## Development Workflow

### Starting Development

```bash
# Run all apps in development mode
bun dev

# Run specific app
cd apps/next && bun dev
cd apps/expo && bun start
```

### Code Quality

```bash
# Run linter
bun lint

# Format code
bun format

# Type checking
bun type-check
```

### Building

```bash
# Build all packages
bun build

# Build specific package
cd apps/next && bun build
```

## Architecture Overview

Iterate follows Clean Architecture principles with three main layers:

### 1. Domain Layer (`packages/app/domain/`)

Pure TypeScript with no external dependencies. Contains:
- **Models**: Data structures (Card, Deck, ReviewLog)
- **Repository Interfaces**: Contracts for data access

Example:
```typescript
// packages/app/domain/model/types.ts
export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  // ... FSRS scheduling fields
}

// packages/app/domain/repository/CardRepository.ts
export interface CardRepository {
  getCard(id: string): Promise<Card | null>
  saveCard(card: Card): Promise<void>
}
```

### 2. Infrastructure Layer (`packages/app/infrastructure/`)

Concrete implementations of repository interfaces:
- **Mock**: In-memory implementation for development
- **Supabase**: Cloud database implementation
- **SQLite**: (Future) Offline database

Example:
```typescript
// packages/app/infrastructure/mock/MockCardRepository.ts
export class MockCardRepository implements CardRepository {
  private cards = new Map<string, Card>()
  
  async getCard(id: string) {
    return this.cards.get(id) || null
  }
}
```

### 3. State Management (`packages/app/store/`)

Jotai atoms for state management:
- **Repository Atoms**: Hold infrastructure implementations
- **Data Atoms**: Fetch and cache data
- **UI State Atoms**: Track UI state

Example:
```typescript
// packages/app/store/atoms.ts
export const cardRepositoryAtom = atom<CardRepository>(
  new MockCardRepository()
)

export const dueCardsAtom = atom(async (get) => {
  const repo = get(cardRepositoryAtom)
  return await repo.getDueCards(new Date())
})
```

## Common Tasks

### Adding a New Model

1. Define the interface in `packages/app/domain/model/types.ts`
2. Export from `packages/app/domain/model/index.ts`
3. Create repository interface in `packages/app/domain/repository/`
4. Implement in `packages/app/infrastructure/mock/`

### Switching Database Implementation

Simply change the atom initialization:

```typescript
// Development (Mock)
export const cardRepositoryAtom = atom(new MockCardRepository())

// Production (Supabase)
export const cardRepositoryAtom = atom(new SupabaseCardRepository())
```

### Using State in Components

```typescript
import { useDueCards } from 'app/store'

function StudyScreen() {
  const dueCards = useDueCards()
  
  return (
    <div>
      <h1>{dueCards.length} cards to review</h1>
    </div>
  )
}
```

## Testing

### Unit Tests

```typescript
import { MockCardRepository } from 'app/infrastructure/mock'

test('saves and retrieves card', async () => {
  const repo = new MockCardRepository()
  const card = { id: '1', /* ... */ }
  
  await repo.saveCard(card)
  const result = await repo.getCard('1')
  
  expect(result).toEqual(card)
})
```

### Component Tests

```typescript
import { render } from '@testing-library/react'
import { Provider } from 'jotai'

test('displays cards', () => {
  render(
    <Provider>
      <StudyScreen />
    </Provider>
  )
  // assertions
})
```

## Environment Variables

### Development

Create `.env.local` files in each app directory:

```bash
# apps/next/.env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# apps/expo/.env.local
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Debugging

### VS Code

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Next.js: debug server-side",
      "cwd": "${workspaceFolder}/apps/next",
      "runtimeExecutable": "bun",
      "runtimeArgs": ["run", "dev"],
      "serverReadyAction": {
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### React DevTools

Install [React DevTools](https://react.dev/learn/react-developer-tools) for debugging components.

### Jotai DevTools

```typescript
import { DevTools } from 'jotai-devtools'

function App() {
  return (
    <>
      <DevTools />
      <YourApp />
    </>
  )
}
```

## Performance Tips

1. **Use Suspense boundaries** for async atoms
2. **Lazy load** heavy components
3. **Memoize** expensive computations
4. **Split atoms** to minimize re-renders

## Troubleshooting

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
bun install
```

### Type errors after updating dependencies

```bash
# Rebuild TypeScript definitions
bun run build
```

### Slow development server

```bash
# Use turbo cache
turbo dev --cache-dir=.turbo
```

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Jotai Docs](https://jotai.org)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [FSRS Algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write tests
4. Submit a pull request

## Questions?

Open an issue on GitHub or check the [documentation](./docs/).
