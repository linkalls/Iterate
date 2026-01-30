import { useState } from 'react'
import { YStack, XStack, Text, Button, Input, TextArea } from 'tamagui'

export interface ImportExportDialogProps {
  mode: 'import' | 'export'
  exportData?: string
  onImport?: (data: string, format: 'csv' | 'json') => void
  onClose: () => void
}

/**
 * ImportExportDialog Component (Phase 5)
 * Handles import and export of card data
 */
export function ImportExportDialog({
  mode,
  exportData,
  onImport,
  onClose,
}: ImportExportDialogProps) {
  const [importData, setImportData] = useState('')
  const [format, setFormat] = useState<'csv' | 'json'>('csv')

  const handleImport = () => {
    if (onImport && importData.trim()) {
      onImport(importData, format)
      onClose()
    }
  }

  const handleCopyToClipboard = () => {
    if (exportData) {
      navigator.clipboard.writeText(exportData)
    }
  }

  return (
    <YStack
      gap="$4"
      padding="$4"
      backgroundColor="$background"
      borderRadius="$4"
      maxWidth={600}
      width="100%"
    >
      <Text fontSize="$7" fontWeight="bold">
        {mode === 'import' ? 'Import Cards' : 'Export Cards'}
      </Text>

      {mode === 'export' ? (
        <>
          <Text fontSize="$4" color="$gray11">
            Copy the data below and save it to a file, or use it to import into another app.
          </Text>
          <TextArea
            value={exportData}
            readOnly
            height={300}
            fontFamily="$mono"
            fontSize="$3"
          />
          <XStack gap="$2" justifyContent="flex-end">
            <Button onPress={handleCopyToClipboard} backgroundColor="$blue6">
              Copy to Clipboard
            </Button>
            <Button onPress={onClose}>Close</Button>
          </XStack>
        </>
      ) : (
        <>
          <YStack gap="$2">
            <Text fontSize="$4">Select Format:</Text>
            <XStack gap="$2">
              <Button
                onPress={() => setFormat('csv')}
                variant={format === 'csv' ? 'outlined' : 'default'}
                backgroundColor={format === 'csv' ? '$blue4' : '$background'}
              >
                CSV (Anki)
              </Button>
              <Button
                onPress={() => setFormat('json')}
                variant={format === 'json' ? 'outlined' : 'default'}
                backgroundColor={format === 'json' ? '$blue4' : '$background'}
              >
                JSON
              </Button>
            </XStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4">Paste your data:</Text>
            <TextArea
              value={importData}
              onChangeText={setImportData}
              placeholder={
                format === 'csv'
                  ? 'front,back,tags\nWord,Definition,Vocabulary'
                  : '{"version": "1.0", "cards": [...]}'
              }
              height={300}
              fontFamily="$mono"
              fontSize="$3"
            />
          </YStack>

          <XStack gap="$2" justifyContent="flex-end">
            <Button onPress={onClose}>Cancel</Button>
            <Button
              onPress={handleImport}
              backgroundColor="$blue6"
              disabled={!importData.trim()}
            >
              Import
            </Button>
          </XStack>
        </>
      )}
    </YStack>
  )
}
