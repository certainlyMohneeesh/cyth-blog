import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'markdownConverter',
  title: 'Markdown Converter',
  type: 'object',
  fields: [
    defineField({
      name: 'markdown',
      title: 'Paste Markdown Here',
      type: 'text',
      rows: 15,
      description: 'Paste your markdown content here. It will be converted to Sanity blocks when you save.',
    }),
  ],
  preview: {
    select: {
      markdown: 'markdown',
    },
    prepare({ markdown }) {
      return {
        title: 'Markdown Content',
        subtitle: markdown ? `${markdown.slice(0, 50)}...` : 'Empty',
      }
    },
  },
})
