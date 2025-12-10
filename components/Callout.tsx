import React from 'react'
import { PortableText } from 'next-sanity'

interface CalloutProps {
  value: {
    type: 'info' | 'warning' | 'success' | 'error' | 'note'
    title?: string
    content: any[]
  }
}

const calloutStyles = {
  info: {
    container: 'bg-blue-50 border-blue-400',
    icon: '💡',
    iconColor: 'text-blue-600',
    title: 'text-blue-900',
    content: 'text-blue-800',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-400',
    icon: '⚠️',
    iconColor: 'text-yellow-600',
    title: 'text-yellow-900',
    content: 'text-yellow-800',
  },
  success: {
    container: 'bg-green-50 border-green-400',
    icon: '✅',
    iconColor: 'text-green-600',
    title: 'text-green-900',
    content: 'text-green-800',
  },
  error: {
    container: 'bg-red-50 border-red-400',
    icon: '❌',
    iconColor: 'text-red-600',
    title: 'text-red-900',
    content: 'text-red-800',
  },
  note: {
    container: 'bg-gray-50 border-gray-400',
    icon: '📝',
    iconColor: 'text-gray-600',
    title: 'text-gray-900',
    content: 'text-gray-800',
  },
}

export function Callout({ value }: CalloutProps) {
  const { type = 'info', title, content } = value
  const styles = calloutStyles[type]

  return (
    <div
      className={`my-6 rounded-lg border-l-4 p-4 ${styles.container}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${styles.iconColor} flex-shrink-0`}>
          {styles.icon}
        </span>
        <div className="flex-1">
          {title && (
            <div className={`font-semibold mb-2 ${styles.title}`}>{title}</div>
          )}
          <div className={`prose-sm ${styles.content}`}>
            <PortableText value={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
