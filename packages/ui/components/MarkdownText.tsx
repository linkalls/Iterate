import React from 'react'
import { Text } from 'tamagui'

export interface MarkdownStyle {
  bold?: boolean
  italic?: boolean
  code?: boolean
}

export interface MarkdownToken {
  text: string
  style: MarkdownStyle
}

/**
 * Parse simple markdown and return formatted tokens
 * Supports: **bold**, *italic*, `code`
 */
function parseMarkdown(text: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = []
  let currentPos = 0
  
  // Find all matches for markdown patterns
  const matches: Array<{ start: number; end: number; text: string; style: MarkdownStyle }> = []
  
  // Bold: **text**
  const boldRegex = /\*\*([^*]+)\*\*/g
  let match
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      style: { bold: true },
    })
  }
  
  // Italic: *text* (but not part of **)
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g
  while ((match = italicRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      style: { italic: true },
    })
  }
  
  // Code: `text`
  const codeRegex = /`([^`]+)`/g
  while ((match = codeRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      style: { code: true },
    })
  }
  
  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)
  
  // Build tokens, avoiding overlaps
  const usedRanges: Array<[number, number]> = []
  matches.forEach((match) => {
    // Check if this range overlaps with any used range
    const overlaps = usedRanges.some(([start, end]) => 
      (match.start >= start && match.start < end) ||
      (match.end > start && match.end <= end) ||
      (match.start <= start && match.end >= end)
    )
    
    if (overlaps) return
    
    // Add plain text before this match
    if (currentPos < match.start) {
      const plainText = text.substring(currentPos, match.start)
      if (plainText) {
        tokens.push({ text: plainText, style: {} })
      }
    }
    
    // Add formatted text
    tokens.push({ text: match.text, style: match.style })
    usedRanges.push([match.start, match.end])
    currentPos = match.end
  })
  
  // Add remaining plain text
  if (currentPos < text.length) {
    const plainText = text.substring(currentPos)
    if (plainText) {
      tokens.push({ text: plainText, style: {} })
    }
  }
  
  return tokens.length > 0 ? tokens : [{ text, style: {} }]
}

interface MarkdownTextProps {
  children: string
  style?: any
}

/**
 * MarkdownText component
 * Renders text with basic markdown formatting
 */
export function MarkdownText({ children, style }: MarkdownTextProps) {
  const tokens = parseMarkdown(children)
  
  return (
    <Text style={style}>
      {tokens.map((token, index) => {
        const tokenStyle: any = {}
        
        if (token.style.bold) {
          tokenStyle.fontWeight = '700'
        }
        
        if (token.style.italic) {
          tokenStyle.fontStyle = 'italic'
        }
        
        if (token.style.code) {
          tokenStyle.fontFamily = 'monospace'
          tokenStyle.backgroundColor = '$surfaceVariant'
          tokenStyle.paddingHorizontal = 4
          tokenStyle.paddingVertical = 2
          tokenStyle.borderRadius = 4
        }
        
        return (
          <Text key={index} style={tokenStyle}>
            {token.text}
          </Text>
        )
      })}
    </Text>
  )
}
