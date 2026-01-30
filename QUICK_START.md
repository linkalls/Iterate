# Quick Start Guide 🚀

Get Iterate running in 5 minutes!

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0 (recommended) or Node.js >= 18
- Git

## 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/linkalls/Iterate.git
cd Iterate

# Install all dependencies
bun install
```

This installs everything you need for web and mobile development!

## 2. Choose Your Platform

### Option A: Web App (Fastest to Start)

```bash
cd apps/next
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

### Option B: Mobile App

```bash
cd apps/expo
bun start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 3. Start Using!

### Create Your First Deck

1. Click/tap "View All Decks"
2. Click "New Deck"
3. Enter name: "Test Deck"
4. Click "Create Deck"

### Add Cards

1. Select your deck
2. Click "Add Card"
3. Front: "What is 2+2?"
4. Back: "4"
5. Click "Create Card"

### Study!

1. Click "Start Studying"
2. See the question
3. Click "Show Answer"
4. Rate your knowledge (Again/Hard/Good/Easy)
5. Notice the interval predictions! (10m, 1d, 3d, 7d)
6. **NEW**: Use keyboard shortcuts (web only) - Press 1-4 to rate!

## 4. Explore New Features ✨

### Search and Filter Decks

1. Go to "View All Decks"
2. Use the search bar to find specific decks
3. Click "Due Today" to filter decks with cards to review
4. Combine search and filters for precise results

### Keyboard Shortcuts (Web Only)

Speed up your studies with keyboard shortcuts:
- **Space/Enter**: Show answer
- **1-4 Keys**: Rate card (Again/Hard/Good/Easy)
- Look for key hints on the rating buttons!

### Track Your Progress

1. Click "📊 View Statistics" from home
2. See your daily and weekly review counts
3. Check your retention rate
4. View card distribution (New/Learning/Review)
5. Get motivated by progress messages!

### Format Cards with Markdown

When creating cards, use markdown for better formatting:
- `**bold text**` for important terms
- `*italic text*` for emphasis
- `` `code` `` for technical terms
- Example: "What is `React`?" → "A **JavaScript** library for building UIs"

## 5. More Features

### FSRS Scheduling

- Rate cards based on how well you knew the answer
- Watch as the algorithm schedules optimal review times
- Cards you struggle with appear more frequently
- Cards you know well appear less frequently

### Create More Content

- Add multiple decks for different topics
- Add many cards to each deck
- Edit deck names and descriptions
- Organize your learning materials

### Cross-Platform

- Start on web, continue on mobile
- Same data (when using shared backend)
- Consistent UI across platforms

**Note**: Keyboard shortcuts are web-only for best experience

## 6. Development Tips

### Project Structure

```
Iterate/
├── apps/
│   ├── expo/       # Mobile app (React Native)
│   └── next/       # Web app (Next.js)
├── packages/
│   ├── app/        # Shared business logic
│   ├── ui/         # Shared UI components
│   └── db/         # Database layer
```

### Making Changes

**Edit a Screen:**
1. Find the screen in `packages/app/features/`
2. Edit the TSX file
3. Save - hot reload shows changes instantly!

**Add a New Screen:**
1. Create `NewScreen.tsx` in appropriate feature folder
2. Export it from `index.tsx`
3. Add navigation route (Expo: `App.tsx`, Next: create page)

**Change Theme:**
1. Edit `packages/ui/tamagui.config.ts`
2. Modify colors, spacing, or fonts
3. Save - all components update automatically!

### Using Mock Data

By default, the app uses in-memory data (MockRepository).

To switch to a real database:
1. Open `packages/app/store/atoms.ts`
2. Change:
   ```typescript
   // From this:
   export const cardRepositoryAtom = atom(new MockCardRepository())
   
   // To this:
   export const cardRepositoryAtom = atom(new DrizzleCardRepository())
   ```

### Common Commands

```bash
# Format all code
bun format

# Run linter
bun lint

# Build everything
bun build

# Clean build artifacts
bun clean
```

## 7. Deploy to Production

### Web App (Vercel)

```bash
cd apps/next

# Install Vercel CLI
npm install -g vercel

# Deploy!
vercel
```

Follow the prompts - your app will be live in ~2 minutes!

### Mobile App (EAS Build)

```bash
cd apps/expo

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

Download and install the build on your device!

## Troubleshooting

### "Module not found" errors

```bash
# Clear everything and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
bun install
```

### Expo won't start

```bash
cd apps/expo
rm -rf .expo
bun start --clear
```

### Next.js won't build

```bash
cd apps/next
rm -rf .next
bun build
```

### TypeScript errors

```bash
# Check TypeScript
cd packages/app
bunx tsc --noEmit
```

## Need Help?

- 📖 Read [docs/FEATURES.md](./docs/FEATURES.md) for new features guide ✨ **NEW**
- 📖 Read [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed docs
- 📖 Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- 📖 See [DEVELOPMENT.md](./DEVELOPMENT.md) for best practices
- 🐛 Open an issue on GitHub
- 💬 Check existing issues for solutions

## What's Next?

Now that you have the app running:

1. **Learn the codebase**
   - Explore `packages/app/features/` for screens
   - Check `packages/app/services/FSRSService.ts` for algorithm
   - Look at `packages/ui/components/` for UI

2. **Make it yours**
   - Customize colors and themes
   - Add new features
   - Improve existing screens
   - Add statistics and charts

3. **Deploy and share**
   - Deploy web app to Vercel
   - Build mobile apps with EAS
   - Share with friends
   - Get feedback and iterate!

## Success! 🎉

You now have a fully functional SRS app running!

- ✅ Create decks
- ✅ Add cards
- ✅ Study with FSRS algorithm
- ✅ See interval predictions
- ✅ Cross-platform ready
- ✅ Production deployment ready

Happy learning and happy coding! 🦊✨
