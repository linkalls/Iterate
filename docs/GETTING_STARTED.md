# Getting Started with Iterate 🦊

Welcome to Iterate! This guide will help you get up and running quickly.

## 🎯 What You'll Build

By following this guide, you'll have:
- ✅ A working development environment
- ✅ Beautiful UI with dark/light themes
- ✅ Functional study sessions
- ✅ Database (your choice: Mock or PostgreSQL)
- ✅ Hot reload for instant feedback

## ⚡ Quick Start (5 minutes)

The fastest way to see Iterate in action:

```bash
# 1. Clone the repository
git clone https://github.com/linkalls/Iterate.git
cd Iterate

# 2. Install dependencies
bun install

# 3. Start development (uses Mock database - no setup!)
bun dev
```

That's it! Open your browser and start exploring.

## 🛠️ Detailed Setup

### Prerequisites

1. **Bun** (recommended) or npm/yarn
   ```bash
   # Install Bun
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Node.js** 18+ (for compatibility)
   ```bash
   # Check version
   node --version
   ```

3. **Git**
   ```bash
   git --version
   ```

### Installation Steps

#### Step 1: Clone Repository

```bash
git clone https://github.com/linkalls/Iterate.git
cd Iterate
```

#### Step 2: Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

This will install all dependencies for the monorepo.

#### Step 3: Choose Your Database

**Option A: Mock Database (No Setup Required)** 

Perfect for getting started quickly!

The Mock implementation is already configured and works out of the box. No additional setup needed.

**Option B: PostgreSQL with Drizzle (Production-Ready)**

For production or if you want to persist data:

1. Set up PostgreSQL:
   ```bash
   # Using Docker
   docker run -d \
     --name iterate-db \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=iterate \
     -p 5432:5432 \
     postgres:15
   
   # Or install PostgreSQL locally
   # macOS: brew install postgresql
   # Ubuntu: sudo apt-get install postgresql
   ```

2. Create `.env` file:
   ```bash
   echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/iterate" > .env
   ```

3. Run migrations:
   ```bash
   cd packages/db
   bun run drizzle-kit generate:pg
   bun run drizzle-kit push:pg
   cd ../..
   ```

4. Switch to Drizzle in code:
   
   Edit `packages/app/store/atoms.ts`:
   ```typescript
   // Change from:
   import { MockCardRepository } from '../infrastructure/mock'
   export const cardRepositoryAtom = atom(new MockCardRepository())
   
   // To:
   import { DrizzleCardRepository } from '../infrastructure/drizzle'
   export const cardRepositoryAtom = atom(new DrizzleCardRepository())
   ```

#### Step 4: Start Development

```bash
# Start all packages in development mode
bun dev

# Or start specific packages
cd apps/next && bun dev    # Web app
cd apps/expo && bun start  # Mobile app
```

The web app will be available at `http://localhost:3000`

## 🎨 First Look

### Home Screen

When you first open Iterate, you'll see:
- Welcome message
- Stats dashboard (0 cards due, 0 decks)
- Theme switcher button (☀️/🌙) in the top right
- Quick action buttons

Try clicking the theme button to see the beautiful light/dark mode transition!

### Creating Your First Deck

1. Click "View All Decks"
2. Click "+ New Deck" (coming in next phase)
3. Or use the Mock data that's pre-loaded

### Studying Cards

With Mock implementation, you'll have sample cards ready:
1. Go to "View All Decks"
2. Click on "English Vocabulary" deck
3. Click "Start Studying"
4. Review cards and rate them (Again/Hard/Good/Easy)

## 🎯 Project Structure Tour

Let's explore the codebase:

```
iterate/
├── packages/
│   ├── app/           # 🧠 Brain of the app
│   │   ├── domain/    # Business logic
│   │   ├── infrastructure/  # Database implementations
│   │   ├── store/     # State management
│   │   └── features/  # UI screens
│   │
│   ├── ui/            # 🎨 Design system
│   │   └── components/  # Reusable components
│   │
│   └── db/            # 💾 Database
│       └── schema.ts  # Database schema
```

### Key Files

- `packages/app/store/atoms.ts` - State management setup
- `packages/app/store/theme.ts` - Theme switching logic
- `packages/ui/tamagui.config.ts` - Theme colors and design tokens
- `packages/app/features/home/HomeScreen.tsx` - Home screen UI
- `packages/app/features/study/StudyScreen.tsx` - Study session UI

## 🧪 Testing It Out

### Try the Mock Data

The Mock implementation comes with sample data:

**Decks:**
- "English Vocabulary" - 2 sample cards
- "Programming Concepts" - Ready for your cards

**Cards:**
- "What is FSRS?" 
- "What does iterate mean?"

### Study a Card

1. Navigate to a deck
2. Start studying
3. See the question
4. Click "Show Answer"
5. Rate your knowledge
6. See progress bar update

### Toggle Theme

Click the sun/moon icon in the top right to switch between:
- ☀️ **Light Mode**: Clean whites, vibrant colors
- 🌙 **Dark Mode**: Comfortable for night studying

## 🚀 Next Steps

### Add Your Own Data

Coming soon: Card and deck creation UI!

For now, you can:
1. Explore the codebase
2. Customize the theme
3. Add features
4. Read the documentation

### Customize the Theme

Edit `packages/ui/tamagui.config.ts`:

```typescript
const lightTheme = {
  primary: '#YOUR_COLOR',  // Change primary color
  // ... other colors
}
```

### Add a New Feature

Follow the architecture:

1. Define domain model in `packages/app/domain/model/`
2. Create repository interface in `packages/app/domain/repository/`
3. Implement in `packages/app/infrastructure/mock/`
4. Add state in `packages/app/store/atoms.ts`
5. Create UI in `packages/app/features/`

## 📚 Learn More

### Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Understand the design
- [Development Guide](./DEVELOPMENT.md) - Development workflow
- [Drizzle Guide](./DRIZZLE.md) - Database management
- [Theming Guide](./THEMING.md) - Customize the look
- [Examples](./EXAMPLES.md) - Code patterns

### Tutorials

Coming soon:
- Creating your first deck
- Adding custom themes
- Deploying to production
- Building mobile apps

## 💡 Tips & Tricks

### Hot Reload

Changes to code automatically reload the app:
- Edit a component
- Save the file
- See changes instantly

### Debugging

Use browser DevTools:
```javascript
// View current theme
console.log(useAtomValue(themeAtom))

// View all decks
console.log(await cardRepo.getAllDecks())
```

### VS Code Setup

Install recommended extensions:
- Prettier - Code formatter
- ESLint - Linting
- TypeScript - Better IntelliSense

## 🆘 Troubleshooting

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
bun install
```

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 bun dev
```

### TypeScript errors

```bash
# Rebuild TypeScript
bun run build
```

### Database connection issues

Check your `DATABASE_URL` in `.env`:
```bash
echo $DATABASE_URL
```

### Mock data not showing

The Mock implementation should work immediately. If not:
1. Check console for errors
2. Verify `MockCardRepository` is imported in `atoms.ts`
3. Clear browser storage and reload

## 🎓 Learning Resources

### Spaced Repetition

- [FSRS Algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki)
- [Spaced Repetition Research](https://www.gwern.net/Spaced-repetition)

### Technologies

- [Jotai State Management](https://jotai.org)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tamagui UI](https://tamagui.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🤝 Get Help

- Open an issue on GitHub
- Check existing documentation
- Read the source code (it's well-commented!)

## ✨ What's Next?

Now that you're set up, try:

1. **Explore the UI** - Click around and see what works
2. **Study some cards** - Try the review flow
3. **Toggle themes** - See the beautiful design
4. **Read the code** - Learn how it works
5. **Add features** - Make it your own!

Happy learning! 🦊📚

---

**"Iterate to evolve!"**
