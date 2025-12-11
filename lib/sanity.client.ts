import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from 'lib/sanity.api'
import {
  heroPostQuery,
  indexQuery,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import type { PreviewData } from 'next'
import { createClient, type SanityClient } from 'next-sanity'

export function getClient(preview?: {
  token: string
  perspective: PreviewData
}): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
    stega: { enabled: preview?.token ? true : false, studioUrl },
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective:
        typeof preview.perspective === 'string'
          ? preview.perspective.split(',')
          : 'drafts',
    })
  }
  return client
}

export const getSanityImageConfig = () => getClient()

export async function getSettings(client: SanityClient): Promise<Settings> {
  try {
    return (await client.fetch(settingsQuery)) || {}
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
}

export async function getHeroPost(client: SanityClient): Promise<Post | null> {
  try {
    return (await client.fetch(heroPostQuery)) || null
  } catch (error) {
    console.error('Error fetching hero post:', error)
    return null
  }
}

export async function getAllPosts(client: SanityClient): Promise<Post[]> {
  try {
    return (await client.fetch(indexQuery)) || []
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  try {
    const client = getClient()
    const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }
}

export async function getPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  try {
    return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return {} as any
  }
}

export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string,
): Promise<{ post: Post; morePosts: Post[] }> {
  try {
    const result = await client.fetch(postAndMoreStoriesQuery, { slug })
    return result || { post: null, morePosts: [] }
  } catch (error) {
    console.error('Error fetching post and more stories:', error)
    return { post: null, morePosts: [] }
  }
}
