import { getClient } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import { allPostsQuery } from 'lib/sanity.queries'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const client = getClient()
    const posts = await client.fetch(allPostsQuery)

    const formattedPosts = posts.map((post: any) => {
      // Construct absolute URL if host is available, otherwise relative
      const baseUrl =
        process.env.NEXT_PUBLIC_VERCEL_URL 
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : req.headers.host 
            ? `http://${req.headers.host}` 
            : ''
            
      const link = `${baseUrl}/posts/${post.slug}`

      return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
        link: link,
        coverImage: post.coverImage
          ? urlForImage(post.coverImage).url()
          : null,
        author: post.author
          ? {
              name: post.author.name,
              avatar: post.author.picture
                ? urlForImage(post.author.picture).url()
                : null,
            }
          : null,
      }
    })

    res.status(200).json(formattedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching posts' })
  }
}
