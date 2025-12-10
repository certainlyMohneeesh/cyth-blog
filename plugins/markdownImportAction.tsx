import { definePlugin } from 'sanity'
import { DocumentActionComponent, useDocumentOperation } from 'sanity'
import { useState } from 'react'
import { markdownToPortableText } from '../lib/markdownConverter'

export const markdownImportAction = definePlugin({
  name: 'markdown-import-action',
  document: {
    actions: (prev, context) => {
      // Only add this action to post documents
      if (context.schemaType !== 'post') {
        return prev
      }
      return [...prev, MarkdownImportAction]
    },
  },
})

const MarkdownImportAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [dialogOpen, setDialogOpen] = useState(false)

  return {
    label: 'Import Markdown',
    icon: () => '📝',
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog: dialogOpen && {
      type: 'dialog',
      onClose: () => setDialogOpen(false),
      header: 'Import Markdown Content',
      content: <MarkdownImportDialog onImport={(blocks) => {
        // Append content
        const currentContent = (props.draft?.content || props.published?.content || []) as any[]
        patch.execute([
          {
            set: {
              content: [...currentContent, ...blocks]
            }
          }
        ])
        setDialogOpen(false)
      }} />,
    },
  }
}

function MarkdownImportDialog({ onImport }: { onImport: (blocks: any[]) => void }) {
  const [markdown, setMarkdown] = useState('')

  const handleImport = () => {
    const blocks = markdownToPortableText(markdown)
    onImport(blocks)
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: 'var(--card-fg-color, inherit)'
          }}
        >
          Paste Markdown Content:
        </label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="# Your Markdown Here..."
          style={{
            width: '100%',
            height: '300px',
            padding: '0.75rem',
            border: '1px solid var(--card-border-color, #ccc)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            backgroundColor: 'var(--card-bg-color, white)',
            color: 'var(--card-fg-color, black)',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        onClick={handleImport}
        disabled={!markdown.trim()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: markdown.trim() ? '#2276FC' : 'var(--card-muted-fg-color, #999)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: markdown.trim() ? 'pointer' : 'not-allowed',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
      >
        Import Markdown
      </button>

      <div 
        style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: 'var(--card-hairline-soft-color, rgba(0, 0, 0, 0.05))', 
          borderRadius: '4px', 
          fontSize: '0.875rem',
          color: 'var(--card-fg-color, inherit)',
          border: '1px solid var(--card-border-color, transparent)'
        }}
      >
        <strong>Tip:</strong> You can import markdown with code blocks, tables, headers, lists, and inline formatting. 
        The content will be converted to Sanity blocks automatically and appended to existing content.
      </div>
    </div>
  )
}
