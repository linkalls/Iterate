# Usage Examples

This document provides practical examples of using the Iterate architecture.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Working with Cards](#working-with-cards)
- [Working with Decks](#working-with-decks)
- [Study Sessions](#study-sessions)
- [Custom Implementations](#custom-implementations)

## Basic Usage

### Reading Data

```typescript
import { useDueCards, useDecks } from 'app/store'

function DashboardScreen() {
  const decks = useDecks()
  const dueCards = useDueCards()
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total decks: {decks.length}</p>
      <p>Cards due today: {dueCards.length}</p>
    </div>
  )
}
```

### Writing Data

```typescript
import { useCardRepository } from 'app/store'
import { Card, CardState } from 'app/domain/model'

function AddCardForm() {
  const cardRepo = useCardRepository()
  
  const handleSubmit = async (front: string, back: string) => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      deckId: 'deck-1',
      front,
      back,
      created: new Date(),
      modified: new Date(),
      due: new Date(),
      stability: 1,
      difficulty: 5,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: CardState.New,
    }
    
    await cardRepo.saveCard(newCard)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

## Working with Cards

### Fetching Cards by Deck

```typescript
import { useAtom } from 'jotai'
import { selectedDeckIdAtom, deckCardsAtom } from 'app/store'

function DeckCardsScreen() {
  const [deckId, setDeckId] = useAtom(selectedDeckIdAtom)
  const cards = useAtomValue(deckCardsAtom)
  
  return (
    <div>
      <h2>Cards in this deck: {cards.length}</h2>
      {cards.map(card => (
        <div key={card.id}>
          <strong>{card.front}</strong>
          <p>{card.back}</p>
        </div>
      ))}
    </div>
  )
}
```

### Updating a Card

```typescript
import { useCardRepository } from 'app/store'
import { Card } from 'app/domain/model'

function EditCardForm({ card }: { card: Card }) {
  const cardRepo = useCardRepository()
  
  const handleUpdate = async (updates: Partial<Card>) => {
    const updatedCard = {
      ...card,
      ...updates,
      modified: new Date(),
    }
    
    await cardRepo.saveCard(updatedCard)
  }
  
  return <form>...</form>
}
```

### Deleting a Card

```typescript
import { useCardRepository } from 'app/store'

function DeleteCardButton({ cardId }: { cardId: string }) {
  const cardRepo = useCardRepository()
  
  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await cardRepo.deleteCard(cardId)
    }
  }
  
  return <button onClick={handleDelete}>Delete</button>
}
```

## Working with Decks

### Creating a Deck

```typescript
import { useDeckRepository } from 'app/store'
import { Deck } from 'app/domain/model'

function CreateDeckForm() {
  const deckRepo = useDeckRepository()
  
  const handleCreate = async (name: string, description: string) => {
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      description,
      created: new Date(),
      modified: new Date(),
    }
    
    await deckRepo.saveDeck(newDeck)
  }
  
  return <form onSubmit={handleCreate}>...</form>
}
```

### Listing All Decks

```typescript
import { useDecks } from 'app/store'

function DeckListScreen() {
  const decks = useDecks()
  
  return (
    <div>
      <h1>My Decks</h1>
      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <h3>{deck.name}</h3>
            <p>{deck.description}</p>
            <small>Created: {deck.created.toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Getting Deck Statistics

```typescript
import { useCardRepository } from 'app/store'
import { useState, useEffect } from 'react'

function DeckStats({ deckId }: { deckId: string }) {
  const cardRepo = useCardRepository()
  const [stats, setStats] = useState({ total: 0, due: 0 })
  
  useEffect(() => {
    async function loadStats() {
      const total = await cardRepo.getCardCount(deckId)
      const dueCards = await cardRepo.getDueCards(new Date(), deckId)
      setStats({ total, due: dueCards.length })
    }
    loadStats()
  }, [deckId, cardRepo])
  
  return (
    <div>
      <p>Total cards: {stats.total}</p>
      <p>Due today: {stats.due}</p>
    </div>
  )
}
```

## Study Sessions

### Basic Study Flow

```typescript
import {
  useDeckDueCards,
  useCurrentCardIndex,
  useShowAnswer,
  useResetStudySession,
} from 'app/store'

function StudyScreen({ deckId }: { deckId: string }) {
  const dueCards = useDeckDueCards()
  const [currentIndex, setCurrentIndex] = useCurrentCardIndex()
  const [showAnswer, setShowAnswer] = useShowAnswer()
  const resetSession = useResetStudySession()
  
  if (dueCards.length === 0) {
    return <div>No cards to review!</div>
  }
  
  if (currentIndex >= dueCards.length) {
    return (
      <div>
        <h2>Session Complete! 🎉</h2>
        <p>Reviewed {dueCards.length} cards</p>
        <button onClick={resetSession}>Start Again</button>
      </div>
    )
  }
  
  const currentCard = dueCards[currentIndex]
  
  return (
    <div>
      <h2>Card {currentIndex + 1} of {dueCards.length}</h2>
      
      <div className="card-front">
        {currentCard.front}
      </div>
      
      {showAnswer && (
        <div className="card-back">
          {currentCard.back}
        </div>
      )}
      
      {!showAnswer ? (
        <button onClick={() => setShowAnswer(true)}>
          Show Answer
        </button>
      ) : (
        <div className="rating-buttons">
          <button onClick={() => handleRating(Rating.Again)}>
            Again
          </button>
          <button onClick={() => handleRating(Rating.Hard)}>
            Hard
          </button>
          <button onClick={() => handleRating(Rating.Good)}>
            Good
          </button>
          <button onClick={() => handleRating(Rating.Easy)}>
            Easy
          </button>
        </div>
      )}
    </div>
  )
}
```

### With FSRS Integration (Future)

```typescript
import { FSRS, Rating } from 'ts-fsrs'
import { useCardRepository } from 'app/store'

function StudyScreen() {
  const cardRepo = useCardRepository()
  const fsrs = new FSRS()
  
  const handleRating = async (card: Card, rating: Rating) => {
    // Calculate next review with FSRS
    const schedulingInfo = fsrs.repeat(card, new Date())
    const updatedCard = schedulingInfo[rating].card
    
    // Save updated card
    await cardRepo.saveCard(updatedCard)
    
    // Move to next card
    setCurrentIndex(prev => prev + 1)
    setShowAnswer(false)
  }
  
  return <div>...</div>
}
```

### Progress Tracking

```typescript
import { useState } from 'react'
import { Rating } from 'app/domain/model'

function StudySessionWithStats() {
  const [ratings, setRatings] = useState<Rating[]>([])
  
  const handleRating = (rating: Rating) => {
    setRatings(prev => [...prev, rating])
    // ... save card
  }
  
  const stats = {
    total: ratings.length,
    again: ratings.filter(r => r === Rating.Again).length,
    hard: ratings.filter(r => r === Rating.Hard).length,
    good: ratings.filter(r => r === Rating.Good).length,
    easy: ratings.filter(r => r === Rating.Easy).length,
  }
  
  const accuracy = ratings.length > 0
    ? ((stats.good + stats.easy) / ratings.length) * 100
    : 0
  
  return (
    <div>
      {/* Study interface */}
      
      <div className="stats">
        <h3>Session Stats</h3>
        <p>Cards reviewed: {stats.total}</p>
        <p>Accuracy: {accuracy.toFixed(1)}%</p>
        <ul>
          <li>Again: {stats.again}</li>
          <li>Hard: {stats.hard}</li>
          <li>Good: {stats.good}</li>
          <li>Easy: {stats.easy}</li>
        </ul>
      </div>
    </div>
  )
}
```

## Custom Implementations

### Creating a Custom Repository

```typescript
import { CardRepository } from 'app/domain/repository'
import { Card } from 'app/domain/model'

export class LocalStorageCardRepository implements CardRepository {
  private readonly KEY = 'iterate-cards'
  
  private getCards(): Map<string, Card> {
    const json = localStorage.getItem(this.KEY)
    return json ? new Map(JSON.parse(json)) : new Map()
  }
  
  private setCards(cards: Map<string, Card>): void {
    localStorage.setItem(this.KEY, JSON.stringify([...cards]))
  }
  
  async getCard(id: string): Promise<Card | null> {
    return this.getCards().get(id) || null
  }
  
  async saveCard(card: Card): Promise<void> {
    const cards = this.getCards()
    cards.set(card.id, card)
    this.setCards(cards)
  }
  
  async deleteCard(id: string): Promise<void> {
    const cards = this.getCards()
    cards.delete(id)
    this.setCards(cards)
  }
  
  async getCardsByDeck(deckId: string): Promise<Card[]> {
    return Array.from(this.getCards().values())
      .filter(card => card.deckId === deckId)
  }
  
  async getDueCards(date: Date, deckId?: string): Promise<Card[]> {
    let cards = Array.from(this.getCards().values())
    
    if (deckId) {
      cards = cards.filter(card => card.deckId === deckId)
    }
    
    return cards.filter(card => card.due <= date)
  }
  
  async getCardCount(deckId: string): Promise<number> {
    return (await this.getCardsByDeck(deckId)).length
  }
}
```

### Using Custom Repository

```typescript
// packages/app/store/atoms.ts
import { LocalStorageCardRepository } from '../infrastructure/localStorage'

export const cardRepositoryAtom = atom<CardRepository>(
  new LocalStorageCardRepository()
)
```

### Hybrid Implementation (Mock + Supabase)

```typescript
export class HybridCardRepository implements CardRepository {
  constructor(
    private local: MockCardRepository,
    private remote: SupabaseCardRepository
  ) {}
  
  async getCard(id: string): Promise<Card | null> {
    // Try local first, fall back to remote
    const localCard = await this.local.getCard(id)
    if (localCard) return localCard
    
    const remoteCard = await this.remote.getCard(id)
    if (remoteCard) {
      // Cache locally
      await this.local.saveCard(remoteCard)
    }
    
    return remoteCard
  }
  
  async saveCard(card: Card): Promise<void> {
    // Save to both
    await this.local.saveCard(card)
    await this.remote.saveCard(card)
  }
  
  // ... implement other methods
}
```

## Best Practices

1. **Always use hooks** instead of directly accessing atoms
2. **Handle loading states** for async atoms
3. **Use Suspense** for better UX
4. **Validate data** before saving
5. **Handle errors** gracefully

### Example with Error Handling

```typescript
function SaveCardButton({ card }: { card: Card }) {
  const cardRepo = useCardRepository()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      await cardRepo.saveCard(card)
      alert('Card saved!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Card'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

### Example with Suspense

```typescript
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DeckListScreen />
    </Suspense>
  )
}
```

## Conclusion

The repository pattern makes it easy to:
- Switch implementations without changing UI code
- Test components with mock data
- Add features like caching, syncing, offline support
- Maintain clean separation of concerns

For more examples, see the [tests](../packages/app/__tests__/) directory.
