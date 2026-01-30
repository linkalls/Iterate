/**
 * Simple markdown-to-React-Native text formatter
 * Supports basic markdown features without external dependencies
 */

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
export function parseMarkdown(text: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = []
  let currentPos = 0
  
  // Regex patterns for markdown
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, style: { bold: true } },      // **bold**
    { regex: /\*([^*]+)\*/g, style: { italic: true } },        // *italic*
    { regex: /`([^`]+)`/g, style: { code: true } },            // `code`
  ]
  
  // Find all matches
  const matches: Array<{ start: number; end: number; text: string; style: MarkdownStyle }> = []
  
  patterns.forEach(({ regex, style }) => {
    let match
    const localRegex = new RegExp(regex.source, regex.flags)
    
    while ((match = localRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        style,
      })
    }
  })
  
  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)
  
  // Build tokens
  matches.forEach((match) => {
    // Add plain text before this match
    if (currentPos < match.start) {
      const plainText = text.substring(currentPos, match.start)
      if (plainText) {
        tokens.push({ text: plainText, style: {} })
      }
    }
    
    // Add formatted text
    tokens.push({ text: match.text, style: match.style })
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

/**
 * Check if text contains markdown formatting
 */
export function hasMarkdown(text: string): boolean {
  return /\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`/.test(text)
}
