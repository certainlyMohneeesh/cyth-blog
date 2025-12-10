import { definePlugin } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'
import { markdownToPortableText } from '../lib/markdownConverter'

export const markdownConverterPlugin = definePlugin({
  name: 'markdown-converter',
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'markdown-converter',
        title: 'Markdown Converter',
        icon: EarthGlobeIcon,
        component: MarkdownConverterTool,
      },
    ]
  },
})

function MarkdownConverterTool() {
  const [markdown, setMarkdown] = React.useState('')
  const [preview, setPreview] = React.useState<any[]>([])
  const [copied, setCopied] = React.useState(false)

  const handleConvert = () => {
    const blocks = markdownToPortableText(markdown)
    setPreview(blocks)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(preview, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Markdown to Sanity Converter
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Paste your markdown content below and convert it to Sanity Portable Text blocks.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Markdown Input
          </h2>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Paste your markdown here..."
            style={{
              width: '100%',
              height: '400px',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
            }}
          />
          <button
            onClick={handleConvert}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2276FC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Convert to Sanity Blocks
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Sanity Blocks (JSON)
            </h2>
            {preview.length > 0 && (
              <button
                onClick={handleCopy}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: copied ? '#22C55E' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy JSON'}
              </button>
            )}
          </div>
          <pre
            style={{
              width: '100%',
              height: '400px',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}
          >
            {preview.length > 0 ? JSON.stringify(preview, null, 2) : 'Preview will appear here...'}
          </pre>
          {preview.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#E8F4FF', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.875rem', color: '#1E40AF' }}>
                <strong>Instructions:</strong> Copy the JSON above and paste it into your post's content field in the Raw JSON editor view.
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Supported Markdown Features:
        </h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>Headers:</strong> # H1, ## H2, ### H3, #### H4</li>
          <li><strong>Code blocks:</strong> ```language ... ```</li>
          <li><strong>Tables:</strong> | Header | Header | with separator line</li>
          <li><strong>Bold:</strong> **bold** or __bold__</li>
          <li><strong>Italic:</strong> *italic* or _italic_</li>
          <li><strong>Inline code:</strong> `code`</li>
          <li><strong>Strikethrough:</strong> ~~text~~</li>
          <li><strong>Links:</strong> [text](url)</li>
          <li><strong>Blockquotes:</strong> &gt; quote</li>
          <li><strong>Lists:</strong> - item or 1. item</li>
        </ul>
      </div>
    </div>
  )
}

import React from 'react'
