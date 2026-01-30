import { useState } from 'react'
import { YStack, XStack, Text, Button, ScrollView } from 'tamagui'
import type { CardTemplate } from 'app/domain/model'

export interface TemplateSelectorProps {
  templates: CardTemplate[]
  onSelect: (template: CardTemplate) => void
  selectedTemplateId?: string
}

/**
 * TemplateSelector Component (Phase 5)
 * Allows users to select a card template for creating cards
 */
export function TemplateSelector({
  templates,
  onSelect,
  selectedTemplateId,
}: TemplateSelectorProps) {
  return (
    <YStack gap="$3" padding="$3">
      <Text fontSize="$6" fontWeight="bold">
        Select a Template
      </Text>
      <ScrollView maxHeight={400}>
        <YStack gap="$2">
          {templates.map((template) => (
            <Button
              key={template.id}
              onPress={() => onSelect(template)}
              variant={selectedTemplateId === template.id ? 'outlined' : 'default'}
              backgroundColor={
                selectedTemplateId === template.id ? '$blue4' : '$background'
              }
              borderColor={selectedTemplateId === template.id ? '$blue8' : '$borderColor'}
              padding="$3"
              justifyContent="flex-start"
            >
              <YStack gap="$1" alignItems="flex-start" width="100%">
                <Text fontSize="$5" fontWeight="600">
                  {template.name}
                </Text>
                {template.description && (
                  <Text fontSize="$3" color="$gray11">
                    {template.description}
                  </Text>
                )}
                <XStack gap="$1" flexWrap="wrap">
                  {template.fields.map((field) => (
                    <Text
                      key={field}
                      fontSize="$2"
                      backgroundColor="$gray4"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      {field}
                    </Text>
                  ))}
                </XStack>
              </YStack>
            </Button>
          ))}
        </YStack>
      </ScrollView>
      {templates.length === 0 && (
        <Text textAlign="center" color="$gray11">
          No templates available
        </Text>
      )}
    </YStack>
  )
}
