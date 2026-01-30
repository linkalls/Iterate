# New Features Guide 🎉

This guide covers the latest features added to Iterate to enhance your learning experience.

## 🔍 Search and Filtering

### Deck Search

Quickly find the deck you need with the search bar on the deck list screen.

**How to use:**
1. Navigate to "View All Decks"
2. Type in the search bar to filter decks by name or description
3. Results update instantly as you type

**Example searches:**
- `javascript` - Find all JavaScript-related decks
- `algorithms` - Find algorithm study decks
- `vocab` - Find vocabulary decks

### Deck Filtering

Filter decks to show only those with cards due for review today.

**How to use:**
1. Click the "Due Today" button to show only decks with cards to review
2. Click "Clear Filters" to reset and show all decks
3. Combine with search for precise filtering

**Benefits:**
- Focus on decks that need immediate attention
- Quickly identify which topics to study
- Better organize your study sessions

## ⌨️ Keyboard Shortcuts (Web Only)

Speed up your study sessions with keyboard shortcuts. Available only on the web version for optimal typing experience.

### Study Session Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `Space` or `Enter` | Show Answer | Reveal the answer side of the card |
| `1` | Rate: Again | Mark card as "Again" (didn't remember) |
| `2` | Rate: Hard | Mark card as "Hard" (struggled to remember) |
| `3` | Rate: Good | Mark card as "Good" (remembered well) |
| `4` | Rate: Easy | Mark card as "Easy" (remembered perfectly) |

**Tips:**
- Visual hints show the key number on each rating button
- Shortcuts only work during study sessions
- Perfect for power users who want to study quickly
- Maintains FSRS algorithm accuracy with quick ratings

### Benefits
- **Faster reviews**: Rate cards without moving your mouse
- **Better flow**: Stay in the zone while studying
- **Efficiency**: Review more cards in less time
- **Ergonomic**: Reduce hand movement between keyboard and mouse

## 📊 Statistics Dashboard

Track your learning progress with comprehensive statistics.

### How to Access
1. From the home screen, click "📊 View Statistics"
2. View your study metrics and progress

### Available Statistics

#### Today's Progress
- **Cards Reviewed**: Number of cards you've reviewed today
- **Cards Due**: Number of cards still waiting for review

#### This Week's Progress
- **Cards Reviewed**: Total cards reviewed this week
- **Total Reviews**: Cumulative review count including multiple reviews of same cards

#### Card Distribution
Visual breakdown of your cards by state:
- **New Cards**: Cards you haven't studied yet (blue)
- **Learning**: Cards you're currently learning (orange)
- **Review**: Cards you've mastered (green)

#### Performance Metrics
- **Average Retention**: Percentage showing how well you're retaining information
  - 80%+: Excellent retention! 🌟
  - 60-80%: Good progress! 👍
  - 40-60%: Keep practicing! 💪
  - Below 40%: Focus on consistent reviews 📚

### Progress Messages
Motivational messages based on your daily performance:
- "Start studying to see your progress!" - No reviews yet
- "Good start! Keep it up! 💪" - 1-9 cards reviewed
- "Great work today! You're on fire! 🔥" - 10-29 cards reviewed
- "Amazing dedication! You're crushing it! 🌟" - 30+ cards reviewed

### Pro Tips (from Statistics)
- Review cards daily for best retention
- Don't hesitate to mark cards as "Again"
- The FSRS algorithm adapts to your pace
- Consistency beats intensity

## 📝 Markdown Support in Cards

Format your flashcards with basic markdown for better readability and emphasis.

### Supported Formatting

| Markdown | Rendered | Use Case |
|----------|----------|----------|
| `**bold**` | **bold** | Important terms, key concepts |
| `*italic*` | *italic* | Emphasis, foreign words |
| `` `code` `` | `code` | Code snippets, commands, technical terms |

### Examples

#### Simple Card
**Front:** What does `console.log()` do in JavaScript?
**Back:** It **prints** output to the *console* for debugging.

#### Code Example
**Front:** How do you declare a variable in JavaScript?
**Back:** Use `const`, `let`, or `var` followed by the variable name.

#### Language Learning
**Front:** What is *hola* in English?
**Back:** Hello (it's a **Spanish** greeting)

### How to Use Markdown

1. When creating or editing a card, simply type markdown in the front or back fields
2. Markdown will automatically be rendered when you study the card
3. No special mode needed - just type naturally with markdown syntax

### Tips for Using Markdown
- Use **bold** for the most important information
- Use *italic* for secondary emphasis or context
- Use `code` for technical terms, commands, or code
- Don't overuse formatting - keep cards simple and clear
- Markdown makes cards easier to scan during review

### Benefits
- **Better readability**: Important information stands out
- **Clearer meaning**: Format conveys importance
- **Code-friendly**: Perfect for programming flashcards
- **Cross-platform**: Works on both web and mobile
- **No dependencies**: Built-in, fast, and reliable

## 🎯 Best Practices

### Combining Features for Maximum Efficiency

**Morning Review Routine:**
1. Check **Statistics** to see your progress
2. Use **Search** to find priority decks
3. Filter **Due Today** to focus on urgent reviews
4. Use **Keyboard Shortcuts** for rapid reviews (web)
5. Review cards with **Markdown** formatting for clarity

**Creating Quality Cards:**
1. Use markdown to highlight key terms
2. Keep questions concise and specific
3. Break complex topics into multiple cards
4. Use the "Due Today" filter to track new cards

**Tracking Progress:**
1. Check statistics weekly to see trends
2. Aim for 80%+ retention rate
3. Review consistently every day
4. Don't skip cards marked as "Hard"

## 🔄 Feature Compatibility

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Search & Filter | ✅ | ✅ | ✅ |
| Statistics | ✅ | ✅ | ✅ |
| Markdown | ✅ | ✅ | ✅ |
| Keyboard Shortcuts | ✅ | ❌ | ❌ |

**Note:** Keyboard shortcuts are web-only because:
- Mobile devices use on-screen keyboards
- Touch interface is optimized for mobile
- Desktop experience benefits most from keyboard shortcuts

## 🆘 Troubleshooting

### Search Not Working
- Make sure you're on the deck list screen
- Check for typos in your search query
- Try clearing filters and searching again

### Keyboard Shortcuts Not Responding
- Ensure you're using the web version (not mobile)
- Make sure you're in an active study session
- Check that no input fields have focus
- Try refreshing the page

### Statistics Not Loading
- Wait a few seconds for data to load
- Try navigating away and back to statistics
- Ensure you have cards in your decks

### Markdown Not Rendering
- Check your markdown syntax is correct
- Supported: `**bold**`, `*italic*`, `` `code` ``
- Markdown renders only during study, not in edit mode

## 🎓 Learning More

For more information about Iterate:
- Check out the [README.md](../README.md) for project overview
- See [QUICK_START.md](../QUICK_START.md) for setup guide
- Read about [FSRS Algorithm](https://github.com/open-spaced-repetition/ts-fsrs)

## 🚀 What's Next?

Future enhancements being considered:
- Advanced statistics with charts and graphs
- Import/Export functionality (Anki format)
- Card images and audio support
- Bulk card operations
- Card templates for quick creation

---

**Happy learning! 🦊✨**

Remember: Consistency is key. Use these features to make your study sessions more efficient and enjoyable!
