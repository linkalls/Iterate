# Architecture Overview

## Clean Architecture Principles

Iterate follows Clean Architecture principles to ensure maintainability, testability, and flexibility.

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (React)                     │
│              features/ - Screen components               │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Application Layer (Jotai)                  │  │
│  │         store/ - State management                  │  │
│  │                                                     │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │      Domain Layer (Pure TypeScript)          │ │  │
│  │  │      domain/model - Business entities        │ │  │
│  │  │      domain/repository - Interfaces          │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │                                                     │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │   Infrastructure Layer (External Services)   │ │  │
│  │  │   infrastructure/mock - Dev implementation   │ │  │
│  │  │   infrastructure/supabase - Prod impl        │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Domain Layer (`packages/app/domain/`)
- **Purpose**: Define core business logic and rules
- **Dependencies**: None (completely framework-agnostic)
- **Contents**:
  - `model/`: Data structures (Card, Deck, ReviewLog)
  - `repository/`: Interface definitions for data access

**Key Principle**: The domain layer knows nothing about databases, UI frameworks, or external services.

### Infrastructure Layer (`packages/app/infrastructure/`)
- **Purpose**: Implement interfaces defined in domain layer
- **Dependencies**: External libraries (Supabase, SQLite, etc.)
- **Contents**:
  - `mock/`: In-memory implementations for development
  - `supabase/`: Cloud database implementations
  - `sqlite/`: (Future) Offline database implementations

**Key Principle**: Infrastructure can be swapped without changing domain or application logic.

### Application Layer (`packages/app/store/`)
- **Purpose**: Manage application state and coordinate between layers
- **Dependencies**: Jotai, domain layer
- **Contents**:
  - `atoms.ts`: Global state and dependency injection
  - `hooks.ts`: React hooks for consuming state

**Key Principle**: This is where we "wire up" the application by choosing which infrastructure implementations to use.

### UI Layer (`packages/app/features/`)
- **Purpose**: Render user interface and handle user interactions
- **Dependencies**: React, Tamagui, application layer
- **Contents**:
  - `study/`: Study session screens
  - `deck/`: Deck management screens

## Dependency Injection Pattern

The key to our flexible architecture is the Repository Pattern with Dependency Injection:

```typescript
// 1. Domain Layer: Define the interface
export interface CardRepository {
  getCard(id: string): Promise<Card | null>
  saveCard(card: Card): Promise<void>
  // ...
}

// 2. Infrastructure Layer: Implement the interface
export class MockCardRepository implements CardRepository {
  private cards = new Map<string, Card>()
  
  async getCard(id: string) {
    return this.cards.get(id) || null
  }
  
  async saveCard(card: Card) {
    this.cards.set(card.id, card)
  }
}

export class SupabaseCardRepository implements CardRepository {
  async getCard(id: string) {
    const { data } = await supabase.from('cards')
      .select('*').eq('id', id)
    return data
  }
  
  async saveCard(card: Card) {
    await supabase.from('cards').upsert(card)
  }
}

// 3. Application Layer: Choose implementation
export const cardRepositoryAtom = atom<CardRepository>(
  new MockCardRepository()  // Easy to swap!
)

// 4. UI Layer: Use through abstraction
function StudyScreen() {
  const repo = useCardRepository()
  const card = await repo.getCard('123')
  // UI code doesn't know or care about implementation!
}
```

## Benefits of This Architecture

### 1. Development Speed
- Start coding UI immediately with Mock implementations
- No need to wait for backend setup
- Fast iteration cycles

### 2. Testing
- Easy to write unit tests with Mock repositories
- No database setup required for tests
- Predictable, deterministic test results

### 3. Flexibility
- Switch databases by changing one line of code
- Support multiple backends simultaneously
- Add new features without touching existing code

### 4. Maintainability
- Clear separation of concerns
- Each layer has a single responsibility
- Easy to understand and modify

### 5. Scalability
- Can optimize infrastructure without changing domain logic
- Easy to add caching, offline support, etc.
- Multiple team members can work on different layers

## Data Flow Example

Let's trace how data flows when a user studies a card:

```
1. User presses "Show Answer" button
   └─> UI Layer (StudyScreen component)

2. Component calls hook
   └─> Application Layer (useShowAnswer hook)

3. Hook updates Jotai atom
   └─> showAnswerAtom changes from false to true

4. User rates the card as "Good"
   └─> UI Layer (RatingButton component)

5. Component gets repository from state
   └─> Application Layer (useCardRepository)

6. Component calls repository.saveCard()
   └─> Infrastructure Layer (MockCardRepository.saveCard)

7. Repository saves to data store
   └─> In-memory Map (or Supabase in production)

8. Atoms automatically re-fetch data
   └─> dueCardsAtom updates with new due date

9. UI re-renders with updated state
   └─> Next card is shown
```

## State Management with Jotai

### Why Jotai?

- **Atomic**: Each piece of state is independent
- **Minimal re-renders**: Components only update when their specific atoms change
- **TypeScript-first**: Excellent type inference
- **Simple API**: Less boilerplate than Redux
- **Async support**: Built-in async atom support

### Atom Categories

1. **Repository Atoms**: Hold infrastructure implementations
   ```typescript
   const cardRepositoryAtom = atom<CardRepository>(...)
   ```

2. **Data Atoms**: Fetch and cache data
   ```typescript
   const dueCardsAtom = atom(async (get) => {
     const repo = get(cardRepositoryAtom)
     return await repo.getDueCards(new Date())
   })
   ```

3. **UI State Atoms**: Track UI-specific state
   ```typescript
   const showAnswerAtom = atom(false)
   const currentCardIndexAtom = atom(0)
   ```

### Dependency Graph

```
cardRepositoryAtom
    ↓
    ├─> dueCardsAtom
    │       ↓
    │       └─> (StudyScreen reads this)
    │
    ├─> deckCardsAtom
    │       ↓
    │       └─> (DeckScreen reads this)
    │
    └─> (Any component can use repository directly)
```

## Migration Path

### Phase 1: Development (Current)
```typescript
// Use Mock for everything
const cardRepo = new MockCardRepository()
const deckRepo = new MockDeckRepository()
```

### Phase 2: Backend Integration
```typescript
// Gradually migrate to Supabase
const cardRepo = new SupabaseCardRepository()
const deckRepo = new SupabaseDeckRepository()
const reviewLogRepo = new MockReviewLogRepository() // Still using mock
```

### Phase 3: Offline Support
```typescript
// Add offline-first with sync
const cardRepo = new OfflineFirstRepository(
  new SqliteCardRepository(),    // Local
  new SupabaseCardRepository()   // Remote
)
```

### Phase 4: Optimization
```typescript
// Add caching layer
const cardRepo = new CachedRepository(
  new SupabaseCardRepository(),
  new InMemoryCache()
)
```

## File Organization

```
packages/app/
├── domain/
│   ├── model/
│   │   ├── types.ts           # Card, Deck, ReviewLog interfaces
│   │   └── index.ts           # Re-exports
│   └── repository/
│       ├── CardRepository.ts   # Interface only
│       ├── DeckRepository.ts   # Interface only
│       └── index.ts            # Re-exports
│
├── infrastructure/
│   ├── mock/
│   │   ├── MockCardRepository.ts
│   │   ├── MockDeckRepository.ts
│   │   └── index.ts
│   └── supabase/
│       ├── client.ts                    # Supabase setup
│       ├── SupabaseCardRepository.ts
│       └── index.ts
│
├── store/
│   ├── atoms.ts               # All Jotai atoms
│   ├── hooks.ts               # Custom React hooks
│   └── index.ts               # Re-exports
│
├── features/
│   ├── study/
│   │   ├── StudyScreen.tsx
│   │   └── components/
│   └── deck/
│       ├── DeckListScreen.tsx
│       └── components/
│
└── index.ts                   # Package entry point
```

## Best Practices

1. **Keep domain pure**: No external dependencies in `domain/`
2. **Implement interfaces**: Every infrastructure class must implement a domain interface
3. **Use atoms for state**: Avoid component-level state for shared data
4. **Single responsibility**: Each file should have one clear purpose
5. **Export through index**: Use index.ts files for clean imports

## Testing Strategy

```typescript
// Unit test with mock
it('should save card', async () => {
  const repo = new MockCardRepository()
  const card = { id: '1', /* ... */ }
  
  await repo.saveCard(card)
  const retrieved = await repo.getCard('1')
  
  expect(retrieved).toEqual(card)
})

// Integration test with real backend
it('should sync with Supabase', async () => {
  const repo = new SupabaseCardRepository()
  // Test against actual Supabase instance
})

// Component test with injected mock
it('should display card', () => {
  const mockRepo = new MockCardRepository()
  render(<StudyScreen />, {
    // Inject mock through Jotai Provider
  })
})
```

## Conclusion

This architecture provides:
- ✅ Fast development cycles
- ✅ Easy testing
- ✅ Flexible infrastructure
- ✅ Clear code organization
- ✅ Scalable foundation

It's designed to grow with the application while maintaining simplicity and clarity.
