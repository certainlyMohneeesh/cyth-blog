import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the table',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells ? cells.join(' | ') : 'Empty row',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'hasHeader',
      title: 'First row is header',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows',
    },
    prepare({ caption, rows }) {
      return {
        title: caption || 'Table',
        subtitle: rows ? `${rows.length} rows` : 'Empty table',
      }
    },
  },
})
