import { useLiveQuery } from '@sanity/preview-kit'
import IndexPage, { type IndexPageProps } from 'components/IndexPage'
import {
  heroPostQuery,
  indexQuery,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'

export default function PreviewIndexPage(props: IndexPageProps) {
  const [posts, loadingPosts] = useLiveQuery<Post[]>(props.posts, indexQuery)
  const [heroPost, loadingHeroPost] = useLiveQuery<Post | null>(
    props.heroPost,
    heroPostQuery,
  )
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery,
  )

  return (
    <IndexPage
      preview
      loading={loadingPosts || loadingHeroPost || loadingSettings}
      posts={posts || []}
      heroPost={heroPost || null}
      settings={settings || {}}
    />
  )
}
