import { XStack, Button, Text } from 'tamagui'

export interface BulkActionsMenuProps {
  selectedCount: number
  onDelete: () => void
  onMove: () => void
  onReset: () => void
  onDuplicate: () => void
  onExport: () => void
  disabled?: boolean
}

/**
 * BulkActionsMenu Component (Phase 5)
 * Provides bulk operations for multiple selected cards
 */
export function BulkActionsMenu({
  selectedCount,
  onDelete,
  onMove,
  onReset,
  onDuplicate,
  onExport,
  disabled = false,
}: BulkActionsMenuProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <XStack
      gap="$2"
      padding="$3"
      backgroundColor="$blue2"
      borderRadius="$4"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text fontSize="$4" fontWeight="600">
        {selectedCount} card{selectedCount > 1 ? 's' : ''} selected
      </Text>
      
      <XStack gap="$2" flex={1} justifyContent="flex-end" flexWrap="wrap">
        <Button
          size="$3"
          onPress={onMove}
          disabled={disabled}
          backgroundColor="$blue6"
        >
          Move
        </Button>
        
        <Button
          size="$3"
          onPress={onDuplicate}
          disabled={disabled}
          backgroundColor="$green6"
        >
          Duplicate
        </Button>
        
        <Button
          size="$3"
          onPress={onReset}
          disabled={disabled}
          backgroundColor="$orange6"
        >
          Reset Progress
        </Button>
        
        <Button
          size="$3"
          onPress={onExport}
          disabled={disabled}
          backgroundColor="$purple6"
        >
          Export
        </Button>
        
        <Button
          size="$3"
          onPress={onDelete}
          disabled={disabled}
          backgroundColor="$red6"
        >
          Delete
        </Button>
      </XStack>
    </XStack>
  )
}
