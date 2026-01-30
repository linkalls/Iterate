# Phase 5 Features - Documentation

This document describes the Phase 5 features added to Iterate, including media support, card templates, bulk operations, and import/export functionality.

## 📋 Overview

Phase 5 adds powerful productivity features to make card creation and management more efficient:

- **Media Support**: Add images and audio to enhance learning
- **Card Templates**: Create multiple cards from reusable templates
- **Bulk Operations**: Manage multiple cards at once
- **Import/Export**: Transfer cards between devices and apps

## 🖼️ Media Support

### Card Images and Audio

Cards now support optional images and audio files on both front and back sides.

#### Usage in Code

```typescript
import { Card } from 'app/domain/model'

const cardWithMedia: Card = {
  // ... other card properties
  frontImage: 'https://example.com/image.jpg',  // or base64 data
  backImage: 'data:image/png;base64,...',
  frontAudio: 'https://example.com/audio.mp3',
  backAudio: 'data:audio/mp3;base64,...',
}
```

#### UI Component

Use the `MediaUpload` component to handle file uploads:

```typescript
import { MediaUpload } from 'ui/components'

<MediaUpload
  label="Front Image"
  mediaType="image"
  mediaUrl={card.frontImage}
  onUpload={(data) => setCard({ ...card, frontImage: data })}
  onRemove={() => setCard({ ...card, frontImage: undefined })}
/>
```

#### Supported Formats

- **Images**: JPEG, PNG, GIF, WebP (recommended: under 1MB)
- **Audio**: MP3, WAV, OGG (recommended: under 5MB)

#### Storage

Media can be stored as:
- **URLs**: Link to external resources (recommended for production)
- **Base64**: Embedded data (good for development/offline use)

## 📋 Card Templates

### Overview

Card templates allow you to create multiple similar cards efficiently using a template system with field placeholders.

### Template Structure

```typescript
import { CardTemplate } from 'app/domain/model'

const template: CardTemplate = {
  id: 'vocab-template-1',
  name: 'Vocabulary Card',
  description: 'Basic vocabulary with word and definition',
  frontTemplate: '{{word}}',
  backTemplate: '**Definition:** {{definition}}\n\n**Example:** {{example}}',
  fields: ['word', 'definition', 'example'],
  created: new Date(),
  modified: new Date(),
}
```

### Creating Cards from Templates

```typescript
import { CardTemplateService } from 'app/services'

// Define field values for multiple cards
const fieldValues = [
  { word: 'iterate', definition: 'to repeat', example: 'We iterate on our designs.' },
  { word: 'enhance', definition: 'to improve', example: 'We enhance the user experience.' },
]

// Create cards
const cards = CardTemplateService.createCardsFromTemplate(
  template,
  fieldValues,
  deckId
)
```

### Template Syntax

Templates use `{{fieldName}}` placeholders:

- `{{word}}` - Simple field replacement
- `{{definition}}` - Another field
- `**{{word}}**` - Can be combined with markdown

### Pre-built Templates

The system includes sample templates:

1. **Vocabulary Card**: Word with definition and example
2. **Language Translation**: Native language to translation
3. **Programming Concept**: Code snippets with explanations

### UI Component

```typescript
import { TemplateSelector } from 'ui/components'

<TemplateSelector
  templates={templates}
  selectedTemplateId={selectedId}
  onSelect={(template) => setSelectedTemplate(template)}
/>
```

## ⚡ Bulk Operations

### Available Operations

The `BulkOperationsService` provides efficient batch operations:

#### 1. Delete Multiple Cards

```typescript
import { BulkOperationsService } from 'app/services'

const bulkService = new BulkOperationsService(cardRepository)
await bulkService.deleteCards(['card-1', 'card-2', 'card-3'])
```

#### 2. Move Cards to Another Deck

```typescript
await bulkService.moveCardsToDeck(
  ['card-1', 'card-2'],
  'target-deck-id'
)
```

#### 3. Reset Card Progress

Resets cards back to "New" state:

```typescript
await bulkService.resetCards(['card-1', 'card-2'])
```

#### 4. Duplicate Cards

Creates copies of cards:

```typescript
const duplicates = await bulkService.duplicateCards(['card-1', 'card-2'])
// Returns array of newly created cards
```

### UI Component

```typescript
import { BulkActionsMenu } from 'ui/components'

<BulkActionsMenu
  selectedCount={selectedCards.length}
  onDelete={() => handleBulkDelete(selectedCards)}
  onMove={() => handleBulkMove(selectedCards)}
  onReset={() => handleBulkReset(selectedCards)}
  onDuplicate={() => handleBulkDuplicate(selectedCards)}
  onExport={() => handleBulkExport(selectedCards)}
/>
```

## 🔄 Import/Export

### Supported Formats

1. **Anki CSV**: Compatible with Anki's basic format
2. **JSON**: Full data preservation with all FSRS metadata

### Export Cards

#### Export to CSV (Anki Format)

```typescript
import { ImportExportService } from 'app/services'

const csvContent = ImportExportService.exportToAnkiCSV(cards, deck)
// Returns: "front,back,tags\nWord,Definition,DeckName"

// Download or copy to clipboard
const blob = new Blob([csvContent], { type: 'text/csv' })
const url = URL.createObjectURL(blob)
```

#### Export to JSON

```typescript
const jsonContent = ImportExportService.exportToJSON(cards, deck)
// Returns full JSON with all card data and metadata
```

### Import Cards

#### Import from CSV

```typescript
const csvContent = `
front,back,tags
Apple,A red fruit,Vocabulary
Orange,A citrus fruit,Vocabulary
`

const importedCards = ImportExportService.importFromAnkiCSV(
  csvContent,
  targetDeckId
)

// Save to repository
for (const card of importedCards) {
  await cardRepository.saveCard(card)
}
```

#### Import from JSON

```typescript
const jsonContent = `{
  "version": "1.0",
  "deck": {"name": "My Deck"},
  "cards": [...]
}`

const importedCards = ImportExportService.importFromJSON(
  jsonContent,
  targetDeckId
)
```

### Validation

Always validate import data before processing:

```typescript
const validation = ImportExportService.validateImportFormat(content, 'csv')
if (!validation.valid) {
  console.error('Invalid format:', validation.error)
  return
}
```

### UI Component

```typescript
import { ImportExportDialog } from 'ui/components'

// Export mode
<ImportExportDialog
  mode="export"
  exportData={csvContent}
  onClose={() => setShowDialog(false)}
/>

// Import mode
<ImportExportDialog
  mode="import"
  onImport={(data, format) => handleImport(data, format)}
  onClose={() => setShowDialog(false)}
/>
```

## 🗄️ Repository Implementation

### CardTemplateRepository

The new `CardTemplateRepository` interface:

```typescript
interface CardTemplateRepository {
  getTemplate(id: string): Promise<CardTemplate | null>
  getAllTemplates(): Promise<CardTemplate[]>
  getTemplatesByDeck(deckId: string): Promise<CardTemplate[]>
  saveTemplate(template: CardTemplate): Promise<void>
  deleteTemplate(id: string): Promise<void>
}
```

### Mock Implementation

For development, use `MockCardTemplateRepository`:

```typescript
import { MockCardTemplateRepository } from 'app/infrastructure/mock'

const templateRepo = new MockCardTemplateRepository()
const templates = await templateRepo.getAllTemplates()
// Returns 3 pre-built sample templates
```

### Jotai Atom

Access templates via the store:

```typescript
import { useAtom } from 'jotai'
import { templatesAtom } from 'app/store'

const [templates] = useAtom(templatesAtom)
```

## 🎨 UI Components Reference

### MediaUpload

Props:
- `label`: Display label
- `mediaUrl`: Current media URL or base64
- `mediaType`: 'image' or 'audio'
- `onUpload`: Callback with uploaded data
- `onRemove`: Callback to remove media

### TemplateSelector

Props:
- `templates`: Array of available templates
- `selectedTemplateId`: Currently selected template
- `onSelect`: Callback when template is selected

### BulkActionsMenu

Props:
- `selectedCount`: Number of selected items
- `onDelete`, `onMove`, `onReset`, `onDuplicate`, `onExport`: Action callbacks
- `disabled`: Disable all actions

### ImportExportDialog

Props:
- `mode`: 'import' or 'export'
- `exportData`: Data to export (if in export mode)
- `onImport`: Callback with imported data
- `onClose`: Callback to close dialog

## 🔐 Best Practices

### Media Files

1. **Optimize images** before upload (compress, resize)
2. **Use external URLs** in production for better performance
3. **Limit file sizes** to prevent slow loading
4. **Consider offline support** when using URLs

### Templates

1. **Keep templates simple** for better reusability
2. **Use descriptive field names** like `word`, `definition`
3. **Test with sample data** before bulk creation
4. **Version templates** if you update them frequently

### Bulk Operations

1. **Show confirmation** before destructive operations (delete, reset)
2. **Provide undo** if possible
3. **Handle errors gracefully** (some cards might fail)
4. **Show progress** for large operations

### Import/Export

1. **Validate data** before importing
2. **Backup before** importing to existing decks
3. **Test with small datasets** first
4. **Handle encoding issues** (UTF-8 recommended)

## 📊 Database Schema Updates

The Card model now includes:

```typescript
interface Card {
  // Existing fields...
  
  // Phase 5 additions:
  frontImage?: string    // Optional image URL/base64
  backImage?: string     // Optional image URL/base64
  frontAudio?: string    // Optional audio URL/base64
  backAudio?: string     // Optional audio URL/base64
  templateId?: string    // Optional reference to template
}
```

New CardTemplate model:

```typescript
interface CardTemplate {
  id: string
  name: string
  description?: string
  deckId?: string
  frontTemplate: string
  backTemplate: string
  fields: string[]
  created: Date
  modified: Date
}
```

## 🚀 Migration Guide

### From Phase 4 to Phase 5

Existing cards are fully compatible. New fields are optional:

```typescript
// Existing cards work as-is
const oldCard: Card = {
  id: '1',
  front: 'Hello',
  back: 'World',
  // ... other fields
  // No media or template fields needed
}

// New cards can use media
const newCard: Card = {
  ...oldCard,
  frontImage: 'https://example.com/image.jpg',
  templateId: 'template-1',
}
```

### Database Migration

If using Drizzle ORM, add new columns:

```sql
ALTER TABLE cards 
  ADD COLUMN front_image TEXT,
  ADD COLUMN back_image TEXT,
  ADD COLUMN front_audio TEXT,
  ADD COLUMN back_audio TEXT,
  ADD COLUMN template_id TEXT;

CREATE TABLE card_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  deck_id TEXT,
  front_template TEXT NOT NULL,
  back_template TEXT NOT NULL,
  fields TEXT NOT NULL,  -- JSON array
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);
```

## 🎯 Next Steps

Phase 5 provides the foundation for:

- **Phase 6**: User authentication and cloud sync
- **Advanced statistics**: Charts using imported historical data
- **Collaborative features**: Share templates and decks
- **Mobile optimization**: Offline media storage

## 📚 Examples

See example implementations in:
- `/packages/app/infrastructure/mock/MockCardTemplateRepository.ts` - Sample templates
- `/packages/ui/components/` - UI components with TypeScript types
- `/packages/app/services/` - Service implementations

For questions or issues, please file an issue on GitHub.
