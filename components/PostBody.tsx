/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */
import { PortableText, type PortableTextReactComponents } from 'next-sanity'

import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'
import { SanityImage } from './SanityImage'
import { Table } from './Table'
import { YouTube } from './YouTube'

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      return <SanityImage {...value} />
    },
    code: ({ value }) => {
      return <CodeBlock value={value} />
    },
    table: ({ value }) => {
      return <Table value={value} />
    },
    callout: ({ value }) => {
      return <Callout value={value} />
    },
    youtube: ({ value }) => {
      return <YouTube value={value} />
    },
  },
  marks: {
    link: ({ value, children }) => {
      const target = value?.blank ? '_blank' : undefined
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined
      return (
        <a href={value?.href} target={target} rel={rel} className="text-blue-600 hover:text-blue-800 underline">
          {children}
        </a>
      )
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
  },
}

export default function PostBody({ content }) {
  return (
    <div className="mx-auto max-w-4xl prose prose-lg">
      <PortableText value={content} components={myPortableTextComponents} />
    </div>
  )
}
