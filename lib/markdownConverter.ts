// Utility to convert markdown to Sanity Portable Text blocks

interface PortableTextBlock {
  _type: string
  _key: string
  [key: string]: any
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  const lines = markdown.split('\n')
  let inCodeBlock = false
  let codeLanguage = ''
  let codeContent: string[] = []
  let inTable = false
  let tableRows: string[][] = []
  let tableHasHeader = false
  let listStack: Array<{ level: number; type: 'bullet' | 'number' }> = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLanguage = trimmedLine.slice(3).trim() || 'text'
        codeContent = []
      } else {
        // End of code block
        blocks.push({
          _type: 'code',
          _key: generateKey(),
          language: codeLanguage,
          code: codeContent.join('\n'),
        })
        inCodeBlock = false
        codeLanguage = ''
        codeContent = []
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    // Handle tables
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (!inTable) {
        inTable = true
        tableRows = []
      }
      
      // Skip separator line (e.g., |---|---|)
      if (trimmedLine.match(/^\|[\s\-:|]+\|$/)) {
        tableHasHeader = tableRows.length > 0
        continue
      }

      const cells = trimmedLine
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim())
      
      tableRows.push(cells)
      continue
    } else if (inTable && tableRows.length > 0) {
      // End of table
      blocks.push({
        _type: 'table',
        _key: generateKey(),
        hasHeader: tableHasHeader,
        rows: tableRows.map(cells => ({
          _key: generateKey(),
          cells,
        })),
      })
      inTable = false
      tableRows = []
      tableHasHeader = false
    }

    // Skip empty lines
    if (!trimmedLine) {
      listStack = []
      continue
    }

    // Handle headers
    if (trimmedLine.startsWith('#')) {
      listStack = []
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const text = trimmedLine.replace(/^#+\s*/, '')
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style,
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('>')) {
      listStack = []
      const text = trimmedLine.replace(/^>\s*/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    // Handle lists with proper nesting
    const bulletMatch = line.match(/^(\s*)([\*\-\+])\s+(.+)$/)
    const numberedMatch = line.match(/^(\s*)(\d+\.)\s+(.+)$/)
    
    if (bulletMatch) {
      const indent = bulletMatch[1].length
      const text = bulletMatch[3]
      const level = Math.floor(indent / 2) + 1
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'bullet',
        level,
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    if (numberedMatch) {
      const indent = numberedMatch[1].length
      const text = numberedMatch[3]
      const level = Math.floor(indent / 2) + 1
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'number',
        level,
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    // Handle normal paragraphs with inline formatting
    listStack = []
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: parseInlineMarks(trimmedLine),
      markDefs: [],
    })
  }

  // Handle any remaining table
  if (inTable && tableRows.length > 0) {
    blocks.push({
      _type: 'table',
      _key: generateKey(),
      hasHeader: tableHasHeader,
      rows: tableRows.map(cells => ({
        _key: generateKey(),
        cells,
      })),
    })
  }

  return blocks
}

function parseInlineMarks(text: string): any[] {
  const children: any[] = []
  const segments: Array<{
    start: number
    end: number
    content: string
    marks: string[]
    href?: string
  }> = []

  // Create a working copy of the text to track what's been processed
  let processedRanges: Array<{ start: number; end: number }> = []

  // Process in order of precedence: links first, then bold, italic, code, strikethrough
  const patterns = [
    { 
      regex: /\[([^\]]+)\]\(([^)]+)\)/g, 
      type: 'link',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: [] as string[],
        href: match[2] as string | undefined,
      })
    },
    { 
      regex: /\*\*([^*]+)\*\*/g, 
      type: 'strong',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['strong'],
        href: undefined as string | undefined,
      })
    },
    { 
      regex: /__([^_]+)__/g, 
      type: 'strong',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['strong'],
        href: undefined as string | undefined,
      })
    },
    { 
      regex: /\*([^*]+)\*/g, 
      type: 'em',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['em'],
        href: undefined as string | undefined,
      })
    },
    { 
      regex: /_([^_]+)_/g, 
      type: 'em',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['em'],
        href: undefined as string | undefined,
      })
    },
    { 
      regex: /`([^`]+)`/g, 
      type: 'code',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['code'],
        href: undefined as string | undefined,
      })
    },
    { 
      regex: /~~([^~]+)~~/g, 
      type: 'strike-through',
      handler: (match: RegExpExecArray) => ({
        content: match[1],
        marks: ['strike-through'],
        href: undefined as string | undefined,
      })
    },
  ]

  // Find all pattern matches
  patterns.forEach(({ regex, type, handler }) => {
    const regexCopy = new RegExp(regex.source, regex.flags)
    let match
    
    while ((match = regexCopy.exec(text)) !== null) {
      const start = match.index
      const end = match.index + match[0].length
      
      // Check if this range overlaps with already processed ranges
      const overlaps = processedRanges.some(
        range => (start >= range.start && start < range.end) || 
                 (end > range.start && end <= range.end) ||
                 (start <= range.start && end >= range.end)
      )
      
      if (!overlaps) {
        const result = handler(match)
        segments.push({
          start,
          end,
          content: result.content,
          marks: result.marks || [],
          href: result.href,
        })
        
        // Mark this range as processed for non-link patterns
        if (type !== 'link') {
          processedRanges.push({ start, end })
        }
      }
    }
  })

  // Sort segments by start position
  segments.sort((a, b) => a.start - b.start)

  // If no matches, return plain text
  if (segments.length === 0) {
    return [
      {
        _type: 'span',
        _key: generateKey(),
        text,
        marks: [],
      },
    ]
  }

  // Build children with marks
  let currentPos = 0
  const markDefs: any[] = []

  segments.forEach(segment => {
    // Add plain text before this segment
    if (segment.start > currentPos) {
      const plainText = text.slice(currentPos, segment.start)
      if (plainText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: plainText,
          marks: [],
        })
      }
    }

    // Add the marked segment
    if (segment.href) {
      // This is a link
      const markDefKey = generateKey()
      markDefs.push({
        _key: markDefKey,
        _type: 'link',
        href: segment.href,
      })
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: segment.content,
        marks: [markDefKey],
      })
    } else {
      // Regular mark (bold, italic, code, etc.)
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: segment.content,
        marks: segment.marks,
      })
    }

    currentPos = segment.end
  })

  // Add any remaining plain text
  if (currentPos < text.length) {
    const remainingText = text.slice(currentPos)
    if (remainingText) {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: remainingText,
        marks: [],
      })
    }
  }

  return children
}
