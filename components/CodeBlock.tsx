import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface CodeBlockProps {
  value: {
    code: string
    language?: string
    filename?: string
  }
}

export function CodeBlock({ value }: CodeBlockProps) {
  const { code, language = 'text', filename } = value

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📄</span>
            <span>{filename}</span>
          </div>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        {!filename && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800 rounded border border-gray-700">
              {language}
            </span>
          </div>
        )}
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
