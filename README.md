# Iterate 🦊

**Iterate** - A beautiful, cross-platform spaced repetition system (SRS) learning app built with modern technologies.

> "繰り返して進化する" - Evolve through repetition

![Dark Mode](https://img.shields.io/badge/theme-dark%20%7C%20light-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)

## ✨ Features

- 🎨 **Beautiful UI** - Carefully crafted interface with attention to detail
- 🌓 **Dark & Light Themes** - Eye-friendly modes for day and night study
- 📚 **FSRS Algorithm** - State-of-the-art spaced repetition scheduling
- 🔄 **Cross-Platform** - Single codebase for Web, iOS, and Android
- 💾 **Type-Safe Database** - Drizzle ORM with full TypeScript support
- ⚡ **Fast & Responsive** - Optimized performance with Jotai state management
- 🎯 **Clean Architecture** - Maintainable, testable, and extensible code

## 🎬 Quick Start

```bash
# Clone the repository
git clone https://github.com/linkalls/Iterate.git
cd Iterate

# Install dependencies with Bun
bun install

# Start development server
bun dev
```

## 📖 Overview

Iterate is a powerful SRS (Spaced Repetition System) application designed to help you learn and retain information effectively. Built with a modern monorepo architecture, it provides a seamless experience across web and mobile platforms.

### What Makes Iterate Special?

- **Anki-Level Quality**: Incredibly polished UX/UI rivaling the best SRS apps
- **Modern Stack**: Built with the latest technologies for best performance
- **Flexible Backend**: Easy to switch between databases (Mock, Drizzle, Supabase)
- **Developer-Friendly**: Clean architecture makes it easy to understand and extend

## 🏗️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Monorepo** | Turborepo | Fast, efficient monorepo management |
| **Package Manager** | Bun | Lightning-fast installation and execution |
| **Web** | Next.js (App Router) | SEO-optimized web application |
| **Mobile** | Expo (React Native) | iOS/Android native apps |
| **UI Library** | Tamagui | Beautiful, cross-platform UI components |
| **Database** | Drizzle ORM (@beta) | Type-safe database queries |
| **Backend** | PostgreSQL / Supabase | Production database (configurable) |
| **SRS Algorithm** | ts-fsrs | FSRS algorithm implementation |
| **State Management** | Jotai | Atomic, performant state updates |
| **Language** | TypeScript | Full type safety |

## 🎨 Design System

### Light Theme
Clean and modern for daytime use:
- **Primary**: Vibrant Indigo (#6366F1)
- **Background**: Pure White (#FFFFFF)
- **Surface**: Subtle Gray (#F8F9FA)
- High contrast for optimal readability

### Dark Theme  
Eye-friendly for low-light environments:
- **Primary**: Lighter Indigo (#818CF8)
- **Background**: Deep Slate (#0F172A)
- **Surface**: Medium Slate (#1E293B)
- WCAG AA compliant contrast ratios

## 📱 Screenshots

### Home Screen
Beautiful dashboard with stats and quick actions, featuring instant theme switching.

### Study Session
Polished flashcard interface with:
- Progress tracking
- Smooth card transitions
- FSRS rating buttons (Again, Hard, Good, Easy)
- Card statistics display

### Deck Management
Organized deck view with:
- Card counts and due dates
- Search and filtering
- Beautiful card-based layout

## 📁 Project Structure

```
iterate/
├── apps/
│   ├── expo/                  # Mobile app (iOS/Android)
│   └── next/                  # Web app (Next.js)
│
├── packages/
│   ├── app/                   # 🎯 Shared application code
│   │   ├── domain/            # Business logic (framework-agnostic)
│   │   │   ├── model/         # Data models (Card, Deck, ReviewLog)
│   │   │   └── repository/    # Repository interfaces
│   │   │
│   │   ├── infrastructure/    # External service implementations
│   │   │   ├── drizzle/       # Drizzle ORM implementation
│   │   │   ├── supabase/      # Supabase implementation (optional)
│   │   │   └── mock/          # In-memory mock for development
│   │   │
│   │   ├── store/             # Jotai state management
│   │   │   ├── atoms.ts       # State atoms and DI container
│   │   │   ├── hooks.ts       # Custom React hooks
│   │   │   └── theme.ts       # Theme state management
│   │   │
│   │   └── features/          # UI screens
│   │       ├── home/          # Home screen with dashboard
│   │       ├── deck/          # Deck management
│   │       └── study/         # Study session
│   │
│   ├── ui/                    # 🎨 Design system
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button.tsx     # Beautiful buttons with variants
│   │   │   ├── Card.tsx       # Flashcard components
│   │   │   ├── DeckCard.tsx   # Deck display cards
│   │   │   ├── Layout.tsx     # Layout primitives
│   │   │   └── Typography.tsx # Text components
│   │   └── tamagui.config.ts  # Theme configuration
│   │
│   └── db/                    # 💾 Database layer
│       ├── schema.ts          # Drizzle schema definitions
│       ├── index.ts           # Database client
│       └── drizzle.config.ts  # Drizzle configuration
│
└── docs/                      # 📚 Documentation
    ├── SPECIFICATION.md       # Product requirements
    ├── ARCHITECTURE.md        # Architecture guide
    ├── DEVELOPMENT.md         # Development guide
    ├── DRIZZLE.md            # Database guide
    ├── THEMING.md            # Theme system guide
    └── EXAMPLES.md           # Code examples
```

## 🚀 Architecture

Iterate follows **Clean Architecture** principles with clear separation of concerns:

### Domain Layer
- **Models**: Pure TypeScript data structures
- **Repository Interfaces**: Define data operations without implementation details
- **Zero Dependencies**: No frameworks, just business logic

### Infrastructure Layer  
Multiple database implementations:
- **Mock Repository**: In-memory data for rapid development
- **Drizzle Repository**: Type-safe PostgreSQL queries
- **Supabase Repository**: Cloud-hosted option (optional)

### State Management (Jotai)
- **Atomic State**: Each piece of state is independent
- **Dependency Injection**: Easy to swap implementations
- **Type-Safe**: Full TypeScript inference

```typescript
// Example: Switching database implementations
// In packages/app/store/atoms.ts

// Development (Mock)
import { MockCardRepository } from '../infrastructure/mock'
export const cardRepositoryAtom = atom(new MockCardRepository())

// Production (Drizzle)
import { DrizzleCardRepository } from '../infrastructure/drizzle'
export const cardRepositoryAtom = atom(new DrizzleCardRepository())
```

### UI Layer
- **Tamagui Components**: Cross-platform, performant
- **Theme System**: Automatic dark/light mode
- **Responsive**: Adapts to screen size

## 🎓 Learning Flow

1. **Create Decks**: Organize cards by topic
2. **Add Cards**: Front/back flashcards with Markdown support
3. **Study**: Review with 4-level rating system
4. **FSRS Magic**: Algorithm schedules optimal review times
5. **Track Progress**: View statistics and retention rates

## 🛠️ Development

### Prerequisites
- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18
- PostgreSQL (for production) or use Mock implementation

### Quick Start

```bash
# Install dependencies
bun install

# Start development
bun dev

# Run linter
bun lint

# Format code
bun format

# Build for production
bun build
```

### Database Setup (Optional)

Using Drizzle ORM:

```bash
# Set database URL
echo "DATABASE_URL=postgresql://..." > .env

# Generate migrations
cd packages/db
bun run drizzle-kit generate:pg

# Apply migrations
bun run drizzle-kit push:pg
```

Or start with Mock implementation (no setup needed)!

## 🧪 Testing Strategy

The repository pattern makes testing easy:

```typescript
// Use MockRepository for unit tests
const mockRepo = new MockCardRepository()
await mockRepo.saveCard(testCard)
const retrieved = await mockRepo.getCard(testCard.id)

expect(retrieved).toEqual(testCard)
```

## 📚 Documentation

Comprehensive guides available in `/docs`:

- **[SPECIFICATION.md](docs/SPECIFICATION.md)** - Complete product requirements (Japanese)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Architecture deep dive
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development guide
- **[DRIZZLE.md](docs/DRIZZLE.md)** - Database usage with Drizzle ORM
- **[THEMING.md](docs/THEMING.md)** - Theme system and customization
- **[EXAMPLES.md](docs/EXAMPLES.md)** - Code examples and patterns

## 🌟 Design Philosophy

1. **User Experience**: Beautiful, intuitive interface
2. **Developer Experience**: Fast setup, clear structure, helpful errors
3. **Flexibility**: Swap implementations without breaking the app
4. **Performance**: Atomic state updates, optimized rendering
5. **Type Safety**: Catch errors at compile time
6. **Maintainability**: Clean architecture for long-term sustainability

## 🎯 Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Monorepo structure
- [x] Clean architecture with repository pattern
- [x] Drizzle ORM integration
- [x] Beautiful UI with Tamagui
- [x] Dark/Light theme system
- [x] Core screens (Home, Decks, Study)

### 🚧 Phase 2: Core Features (In Progress)
- [ ] ts-fsrs integration for scheduling
- [ ] Card creation and editing
- [ ] Deck management (create, edit, delete)
- [ ] Study session with FSRS ratings
- [ ] Progress tracking and statistics

### 📋 Phase 3: Enhancement
- [ ] Markdown support in cards
- [ ] Keyboard shortcuts
- [ ] Search and filtering
- [ ] Import/Export (Anki format)
- [ ] Statistics dashboard

### 🚀 Phase 4: Advanced
- [ ] Authentication system
- [ ] Cloud sync with Supabase
- [ ] Offline mode with SQLite
- [ ] Mobile apps (iOS/Android)
- [ ] Progressive Web App

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon).

## 📄 License

MIT License - See LICENSE file for details

## 🦊 About

Built with passion for learning and iteration.

**"Iterate to evolve!"**

Made by [linkalls](https://github.com/linkalls) - A high school developer passionate about building tools for effective learning.

---

### Star History

If you find this project useful, please consider giving it a ⭐!

### Resources

- [FSRS Algorithm](https://github.com/open-spaced-repetition/ts-fsrs)
- [Jotai Documentation](https://jotai.org)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tamagui](https://tamagui.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)