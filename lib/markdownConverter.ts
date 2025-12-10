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
      continue
    }

    // Handle headers
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const text = trimmedLine.replace(/^#+\s*/, '')
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style,
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text,
            marks: [],
          },
        ],
        markDefs: [],
      })
      continue
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('>')) {
      const text = trimmedLine.replace(/^>\s*/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text,
            marks: [],
          },
        ],
        markDefs: [],
      })
      continue
    }

    // Handle lists
    if (trimmedLine.match(/^[\*\-\+]\s/)) {
      const text = trimmedLine.replace(/^[\*\-\+]\s*/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'bullet',
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    if (trimmedLine.match(/^\d+\.\s/)) {
      const text = trimmedLine.replace(/^\d+\.\s*/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'number',
        children: parseInlineMarks(text),
        markDefs: [],
      })
      continue
    }

    // Handle normal paragraphs with inline formatting
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
  let currentPos = 0
  const markDefs: any[] = []

  // Regex patterns for inline formatting
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, mark: 'strong' },
    { regex: /__(.+?)__/g, mark: 'strong' },
    { regex: /\*(.+?)\*/g, mark: 'em' },
    { regex: /_(.+?)_/g, mark: 'em' },
    { regex: /`(.+?)`/g, mark: 'code' },
    { regex: /~~(.+?)~~/g, mark: 'strike-through' },
    { regex: /\[(.+?)\]\((.+?)\)/g, mark: 'link' },
  ]

  // Find all matches
  const matches: Array<{
    start: number
    end: number
    text: string
    mark: string
    href?: string
  }> = []

  patterns.forEach(({ regex, mark }) => {
    const regexCopy = new RegExp(regex.source, regex.flags)
    let match
    while ((match = regexCopy.exec(text)) !== null) {
      if (mark === 'link') {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1],
          mark,
          href: match[2],
        })
      } else {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1],
          mark,
        })
      }
    }
  })

  // Sort by position
  matches.sort((a, b) => a.start - b.start)

  // If no matches, return plain text
  if (matches.length === 0) {
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
  let lastEnd = 0
  matches.forEach(match => {
    // Add plain text before match
    if (match.start > lastEnd) {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: text.slice(lastEnd, match.start),
        marks: [],
      })
    }

    // Add marked text
    if (match.mark === 'link') {
      const markDefKey = generateKey()
      markDefs.push({
        _key: markDefKey,
        _type: 'link',
        href: match.href,
        blank: true,
      })
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: match.text,
        marks: [markDefKey],
      })
    } else {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: match.text,
        marks: [match.mark],
      })
    }

    lastEnd = match.end
  })

  // Add remaining text
  if (lastEnd < text.length) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: text.slice(lastEnd),
      marks: [],
    })
  }

  return children
}
