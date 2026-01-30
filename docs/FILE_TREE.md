# Iterate Project File Tree

```
iterate/
├── 📚 docs/                                    # Comprehensive documentation
│   ├── ARCHITECTURE.md                        # System design & patterns (10KB)
│   ├── DATABASE.md                            # Supabase setup guide (11KB)
│   ├── DEVELOPMENT.md                         # Dev workflow & tips (6KB)
│   ├── DRIZZLE.md                            # Drizzle ORM guide (5.5KB)
│   ├── EXAMPLES.md                           # Code patterns (12KB)
│   ├── GETTING_STARTED.md                    # Quick setup guide (8KB)
│   ├── SPECIFICATION.md                       # Requirements (JP) (8KB)
│   ├── SUMMARY.md                            # Project metrics (8KB)
│   └── THEMING.md                            # Theme system (7.5KB)
│
├── 📦 packages/
│   │
│   ├── 🧠 app/                               # Application logic & UI
│   │   ├── domain/                           # Framework-agnostic business logic
│   │   │   ├── model/
│   │   │   │   ├── types.ts                  # Card, Deck, ReviewLog models
│   │   │   │   └── index.ts
│   │   │   └── repository/
│   │   │       ├── CardRepository.ts         # Card data interface
│   │   │       ├── DeckRepository.ts         # Deck data interface
│   │   │       ├── ReviewLogRepository.ts    # Review history interface
│   │   │       └── index.ts
│   │   │
│   │   ├── infrastructure/                   # External service implementations
│   │   │   ├── drizzle/                      # PostgreSQL with Drizzle ORM
│   │   │   │   ├── DrizzleCardRepository.ts
│   │   │   │   ├── DrizzleDeckRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── mock/                         # In-memory for development
│   │   │   │   ├── MockCardRepository.ts
│   │   │   │   ├── MockDeckRepository.ts
│   │   │   │   ├── MockReviewLogRepository.ts
│   │   │   │   └── index.ts
│   │   │   └── supabase/                     # Cloud-hosted (optional)
│   │   │       ├── SupabaseCardRepository.ts
│   │   │       ├── client.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── store/                            # Jotai state management
│   │   │   ├── atoms.ts                      # Repository & data atoms
│   │   │   ├── hooks.ts                      # Custom React hooks
│   │   │   ├── theme.ts                      # Theme state
│   │   │   └── index.ts
│   │   │
│   │   ├── features/                         # UI screens
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.tsx            # Dashboard with stats
│   │   │   │   └── index.tsx
│   │   │   ├── deck/
│   │   │   │   ├── DeckListScreen.tsx        # Deck management
│   │   │   │   └── index.tsx
│   │   │   ├── study/
│   │   │   │   ├── StudyScreen.tsx           # Flashcard interface
│   │   │   │   └── index.tsx
│   │   │   └── index.tsx
│   │   │
│   │   ├── package.json                      # App dependencies
│   │   ├── tsconfig.json                     # TypeScript config
│   │   └── index.ts                          # Package entry
│   │
│   ├── 🎨 ui/                                # Design system
│   │   ├── components/
│   │   │   ├── Button.tsx                    # 6 button variants
│   │   │   ├── Card.tsx                      # Flashcard components
│   │   │   ├── DeckCard.tsx                  # Deck display cards
│   │   │   ├── Layout.tsx                    # Layout primitives
│   │   │   ├── Typography.tsx                # 8 text variants
│   │   │   └── index.tsx
│   │   ├── tamagui.config.ts                 # Theme configuration
│   │   ├── package.json                      # UI dependencies
│   │   └── index.tsx                         # Package entry
│   │
│   └── 💾 db/                                # Database layer
│       ├── schema.ts                         # Drizzle schema (tables)
│       ├── drizzle.config.ts                 # Migration config
│       ├── package.json                      # DB dependencies
│       ├── tsconfig.json                     # TypeScript config
│       └── index.ts                          # DB client export
│
├── 🛠️ apps/                                   # Application entry points (TODO)
│   ├── expo/                                 # React Native mobile
│   └── next/                                 # Next.js web
│
├── 📄 Configuration Files
│   ├── package.json                          # Root dependencies
│   ├── tsconfig.json                         # Root TS config
│   ├── turbo.json                            # Turborepo config
│   ├── .gitignore                            # Git ignore rules
│   └── .prettierrc                           # Code formatting
│
└── 📖 README.md                              # Project overview (10KB)

```

## File Statistics

### By Category

**Documentation** (9 files, ~70KB)
- Architecture guides
- API documentation
- Setup instructions
- Code examples

**Domain Layer** (6 files)
- Pure business logic
- Framework-agnostic
- Zero dependencies

**Infrastructure** (11 files)
- 3 repository implementations
- Database clients
- External service adapters

**UI Components** (12 files)
- Design system
- Reusable components
- Theme configuration

**Features** (7 files)
- 3 core screens
- Screen components
- Feature logic

**Database** (5 files)
- Schema definitions
- Migration config
- Type definitions

**Configuration** (6 files)
- Package management
- Build configuration
- TypeScript setup

### By Technology

**TypeScript/TSX**: 48 files
**Markdown**: 10 files (docs + README)
**JSON**: 6 files (configs)
**Total**: 64 files

### Lines of Code

- Domain: ~500 lines
- Infrastructure: ~1,200 lines
- UI: ~1,500 lines
- Features: ~1,800 lines
- Database: ~200 lines
- **Total: ~5,200 lines**

### Documentation

- README: 10KB
- Guides: 60KB
- **Total: 70KB**

## Key Files

### Entry Points
- `packages/app/index.ts` - App package exports
- `packages/ui/index.tsx` - UI package exports
- `packages/db/index.ts` - Database exports

### Core Logic
- `packages/app/domain/model/types.ts` - Data models
- `packages/app/store/atoms.ts` - State management
- `packages/db/schema.ts` - Database schema

### Theme System
- `packages/ui/tamagui.config.ts` - Theme definition
- `packages/app/store/theme.ts` - Theme state

### Main Screens
- `packages/app/features/home/HomeScreen.tsx` - Dashboard
- `packages/app/features/deck/DeckListScreen.tsx` - Deck list
- `packages/app/features/study/StudyScreen.tsx` - Study session

## Architecture Layers

```
┌─────────────────────────────────────────┐
│           UI Layer (React)              │
│         features/ - Screens             │
├─────────────────────────────────────────┤
│      Application Layer (Jotai)          │
│      store/ - State Management          │
├─────────────────────────────────────────┤
│      Domain Layer (Pure TS)             │
│   domain/model - Business Entities      │
│   domain/repository - Interfaces        │
├─────────────────────────────────────────┤
│   Infrastructure Layer (External)       │
│  infrastructure/mock - Dev              │
│  infrastructure/drizzle - Production    │
│  infrastructure/supabase - Cloud        │
└─────────────────────────────────────────┘
```

## Package Dependencies

```
Root
├── Turborepo (monorepo)
├── Bun (package manager)
└── TypeScript

packages/app
├── jotai (state)
├── drizzle-orm (db)
├── db (workspace)
└── ui (workspace)

packages/ui
├── tamagui (UI)
├── react
└── react-native-web

packages/db
├── drizzle-orm
├── postgres
└── drizzle-kit
```

## Navigation

- 📚 Start with [README.md](./README.md)
- 🚀 Quick start: [GETTING_STARTED.md](./docs/GETTING_STARTED.md)
- 🏗️ Architecture: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- 💾 Database: [DRIZZLE.md](./docs/DRIZZLE.md)
- 🎨 Theming: [THEMING.md](./docs/THEMING.md)
- 📝 Examples: [EXAMPLES.md](./docs/EXAMPLES.md)

---

**Made with 🦊 by [@linkalls](https://github.com/linkalls)**
