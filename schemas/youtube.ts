import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube Video URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({ url, caption }) {
      const videoId = url?.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1]
      return {
        title: caption || 'YouTube Video',
        subtitle: videoId ? `Video ID: ${videoId}` : url,
        media: undefined,
      }
    },
  },
})
