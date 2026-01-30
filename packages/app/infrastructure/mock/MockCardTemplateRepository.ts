import { CardTemplate } from '../../domain/model'
import { CardTemplateRepository } from '../../domain/repository'

/**
 * MockCardTemplateRepository
 * In-memory implementation for development and testing (Phase 5)
 */
export class MockCardTemplateRepository implements CardTemplateRepository {
  private templates: Map<string, CardTemplate> = new Map()

  constructor() {
    // Add some sample templates for development
    this.initializeSampleTemplates()
  }

  async getTemplate(id: string): Promise<CardTemplate | null> {
    return this.templates.get(id) || null
  }

  async getAllTemplates(): Promise<CardTemplate[]> {
    return Array.from(this.templates.values())
  }

  async getTemplatesByDeck(deckId: string): Promise<CardTemplate[]> {
    return Array.from(this.templates.values()).filter(
      template => template.deckId === deckId
    )
  }

  async saveTemplate(template: CardTemplate): Promise<void> {
    this.templates.set(template.id, template)
  }

  async deleteTemplate(id: string): Promise<void> {
    this.templates.delete(id)
  }

  private initializeSampleTemplates(): void {
    const now = new Date()

    // Basic vocabulary template
    const vocabTemplate: CardTemplate = {
      id: 'template-1',
      name: 'Vocabulary Card',
      description: 'Basic vocabulary card with word and definition',
      frontTemplate: '{{word}}',
      backTemplate: '**Definition:** {{definition}}\n\n**Example:** {{example}}',
      fields: ['word', 'definition', 'example'],
      created: now,
      modified: now,
    }

    // Language learning template
    const languageTemplate: CardTemplate = {
      id: 'template-2',
      name: 'Language Translation',
      description: 'Translation card for language learning',
      frontTemplate: '{{native}}',
      backTemplate: '{{translation}}\n\n*{{pronunciation}}*',
      fields: ['native', 'translation', 'pronunciation'],
      created: now,
      modified: now,
    }

    // Programming concept template
    const codeTemplate: CardTemplate = {
      id: 'template-3',
      name: 'Programming Concept',
      description: 'Template for programming concepts and code snippets',
      frontTemplate: '**{{concept}}**\n\nWhat is this?',
      backTemplate: '{{explanation}}\n\n```\n{{code}}\n```',
      fields: ['concept', 'explanation', 'code'],
      created: now,
      modified: now,
    }

    this.templates.set(vocabTemplate.id, vocabTemplate)
    this.templates.set(languageTemplate.id, languageTemplate)
    this.templates.set(codeTemplate.id, codeTemplate)
  }
}
