import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

export default function HeroPost(
  props: Pick<
    Post,
    'title' | 'coverImage' | 'date' | 'excerpt' | 'author' | 'slug'
  >,
) {
  const { title, coverImage, date, excerpt, author, slug } = props
  return (
    <section className="mb-16">
      <div className="mb-8 overflow-hidden rounded-2xl shadow-lg md:mb-12">
        <CoverImage slug={slug} title={title} image={coverImage} priority />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-20">
        <div>
          <h3 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl text-balance">
            <Link href={`/posts/${slug}`} className="hover:text-muted-foreground transition-colors">
              {title || 'Untitled'}
            </Link>
          </h3>
          <div className="mb-4 text-base text-muted-foreground md:mb-0">
            <Date dateString={date} />
          </div>
        </div>
        <div className="space-y-4">
          {excerpt && (
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              {excerpt}
            </p>
          )}
          {author && (
            <AuthorAvatar name={author.name} picture={author.picture} />
          )}
        </div>
      </div>
    </section>
  )
}
