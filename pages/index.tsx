import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewIndexPage'
import { readToken } from 'lib/sanity.api'
import { getAllPosts, getClient, getHeroPost, getSettings } from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  posts: Post[]
  heroPost: Post | null
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { posts, heroPost, settings, previewMode } = props

  if (previewMode) {
    return <PreviewIndexPage posts={posts} heroPost={heroPost} settings={settings} />
  }

  return (
    <main>
      <IndexPage posts={posts} heroPost={heroPost} settings={settings} />
    </main>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { preview: previewMode = false, previewData } = ctx
  const client = getClient(
    previewMode ? { token: readToken, perspective: previewData } : undefined,
  )

  const [settings, heroPost, posts = []] = await Promise.all([
    getSettings(client),
    getHeroPost(client),
    getAllPosts(client),
  ])

  return {
    props: {
      posts,
      heroPost,
      settings,
      previewMode,
      previewPerspective: typeof previewData === 'string' ? previewData : null,
      token: previewMode ? readToken : '',
    },
  }
}
