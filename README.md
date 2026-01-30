# Iterate 🦊

**Iterate** - A cross-platform spaced repetition system (SRS) learning app built with modern technologies.

> "繰り返して進化する" - Evolve through repetition

## 📖 Overview

Iterate is a powerful SRS (Spaced Repetition System) application designed to help you learn and retain information effectively. Built with a modern monorepo architecture, it provides a seamless experience across web and mobile platforms.

## 🎯 Key Features

- **FSRS Scheduling**: Advanced spaced repetition algorithm using ts-fsrs
- **Multi-Platform**: Single codebase for Web (Next.js) and Mobile (Expo)
- **Clean Architecture**: Repository pattern with dependency injection
- **Flexible Backend**: Easily swap between Supabase, SQLite, or custom implementations
- **State Management**: Powered by Jotai for atomic, performant state updates
- **Type-Safe**: Written in TypeScript with full type coverage

## 🏗️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Monorepo** | Solito + Turborepo | Share 90% of code between web and mobile |
| **Package Manager** | Bun | Fast installation and execution |
| **Web** | Next.js (App Router) | SEO-optimized web application |
| **Mobile** | Expo (React Native) | iOS/Android native apps |
| **UI** | Tamagui | Cross-platform UI components |
| **Database** | Supabase (configurable) | Authentication, database, real-time sync |
| **SRS Logic** | ts-fsrs | FSRS algorithm implementation |
| **State** | Jotai | Atomic state management |

## 📁 Project Structure

```
iterate/
├── apps/
│   ├── expo/          # Mobile app (iOS/Android)
│   └── next/          # Web app (Next.js)
├── packages/
│   ├── app/           # Shared application code
│   │   ├── domain/    # Business logic (framework-agnostic)
│   │   │   ├── model/        # Data models
│   │   │   └── repository/   # Repository interfaces
│   │   ├── infrastructure/   # External service implementations
│   │   │   ├── supabase/     # Supabase implementation
│   │   │   ├── mock/         # Mock implementation for development
│   │   │   └── sqlite/       # (Future) Offline database
│   │   ├── store/     # Jotai atoms and hooks
│   │   └── features/  # UI components and screens
│   ├── ui/            # Shared UI components (Tamagui)
│   └── db/            # Database utilities
└── docs/              # Documentation
```

## 🚀 Architecture

Iterate follows **Clean Architecture** principles with clear separation of concerns:

### Domain Layer
- **Models**: Pure data structures (Card, Deck, ReviewLog)
- **Repository Interfaces**: Define what operations are needed, not how they work

### Infrastructure Layer
- **Mock Implementation**: In-memory data for rapid development
- **Supabase Implementation**: Production-ready cloud backend
- **Extensible**: Easy to add SQLite, Firebase, or custom backends

### State Management (Jotai)
- **Atomic**: Each piece of state is independent
- **Performant**: Components only re-render when their atoms change
- **Flexible**: Easy to inject different repository implementations

```typescript
// Example: Switching from Mock to Supabase
// In packages/app/store/atoms.ts

// Development (default)
const cardRepo = new MockCardRepository()

// Production
const cardRepo = new SupabaseCardRepository()
```

## 🎓 Learning Flow

1. **Create Decks**: Organize cards by topic (e.g., "English Vocabulary", "Programming Concepts")
2. **Add Cards**: Front/back flashcards with Markdown support
3. **Study**: Review cards with 4-level rating (Again, Hard, Good, Easy)
4. **FSRS Magic**: Algorithm automatically schedules optimal review times
5. **Track Progress**: View statistics and retention rates

## 🛠️ Development Roadmap

### Phase 1: MVP (Minimum Viable Product)
- [x] Project structure and architecture
- [x] Domain models and repository interfaces
- [x] Mock implementation for development
- [x] Jotai state management setup
- [ ] Basic UI components (Tamagui)
- [ ] Study session screen
- [ ] Deck management screen
- [ ] FSRS integration

### Phase 2: Backend Integration
- [ ] Supabase schema and migrations
- [ ] Supabase repository implementation
- [ ] Authentication system
- [ ] Cloud synchronization

### Phase 3: Enhanced Features
- [ ] Dark mode support
- [ ] Markdown rendering in cards
- [ ] Keyboard shortcuts (Web)
- [ ] Statistics dashboard
- [ ] Export/Import functionality

### Phase 4: Offline & Polish
- [ ] SQLite offline support
- [ ] Progressive Web App (PWA)
- [ ] Performance optimizations
- [ ] Comprehensive testing

## 📝 Quick Start

```bash
# Install dependencies
bun install

# Run development servers
bun dev

# Build for production
bun build

# Run linter
bun lint
```

## 🧪 Testing Strategy

The repository pattern makes testing easy:

```typescript
// Use MockRepository for unit tests
const mockRepo = new MockCardRepository()

// Inject into your component
<MyComponent repository={mockRepo} />
```

## 🌟 Design Philosophy

1. **Developer Experience**: Fast setup, clear structure, helpful errors
2. **Flexibility**: Swap implementations without breaking the app
3. **Performance**: Atomic state updates, optimized rendering
4. **Type Safety**: Catch errors at compile time, not runtime
5. **Maintainability**: Clean architecture for long-term sustainability

## 📚 Resources

- [FSRS Algorithm](https://github.com/open-spaced-repetition/ts-fsrs)
- [Jotai Documentation](https://jotai.org)
- [Solito Documentation](https://solito.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📄 License

MIT

## 🦊 About

Built with passion for learning and iteration. 
**"Iterate to evolve!"**