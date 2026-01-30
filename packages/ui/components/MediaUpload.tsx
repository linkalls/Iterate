import { useState } from 'react'
import { YStack, XStack, Text, Button, Image } from 'tamagui'

export interface MediaUploadProps {
  label: string
  mediaUrl?: string
  mediaType: 'image' | 'audio'
  onUpload: (data: string) => void
  onRemove: () => void
}

/**
 * MediaUpload Component (Phase 5)
 * Allows uploading and displaying images or audio files for cards
 */
export function MediaUpload({
  label,
  mediaUrl,
  mediaType,
  onUpload,
  onRemove,
}: MediaUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      onUpload(data)
      setIsLoading(false)
    }
    reader.onerror = () => {
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <YStack gap="$2" width="100%">
      <Text fontSize="$4" fontWeight="600">
        {label}
      </Text>

      {mediaUrl ? (
        <YStack gap="$2">
          {mediaType === 'image' ? (
            <Image
              source={{ uri: mediaUrl }}
              width="100%"
              height={200}
              resizeMode="contain"
              borderRadius="$4"
              backgroundColor="$gray3"
            />
          ) : (
            <XStack
              padding="$3"
              backgroundColor="$gray3"
              borderRadius="$4"
              alignItems="center"
              gap="$2"
            >
              <Text>🔊 Audio file attached</Text>
            </XStack>
          )}
          <Button
            size="$3"
            onPress={onRemove}
            backgroundColor="$red6"
            width="fit-content"
          >
            Remove
          </Button>
        </YStack>
      ) : (
        <XStack gap="$2">
          <input
            type="file"
            accept={mediaType === 'image' ? 'image/*' : 'audio/*'}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id={`file-upload-${label}`}
          />
          <label htmlFor={`file-upload-${label}`}>
            <Button
              size="$3"
              backgroundColor="$blue6"
              disabled={isLoading}
              onPress={(e) => {
                e.preventDefault()
                const input = document.getElementById(`file-upload-${label}`)
                input?.click()
              }}
            >
              {isLoading
                ? 'Uploading...'
                : `Upload ${mediaType === 'image' ? 'Image' : 'Audio'}`}
            </Button>
          </label>
        </XStack>
      )}
    </YStack>
  )
}
