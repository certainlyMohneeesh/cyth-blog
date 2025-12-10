'use client'

import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import Footer from 'components/Footer'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { Suspense } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PortableText } from 'next-sanity'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  heroPost: Post | null
  settings: Settings
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, heroPost, settings } = props
  const { title = demo.title, description = demo.description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                {title}
              </h1>
              
              <div className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                <PortableText value={description} />
              </div>
              
              {heroPost && (
                <Link
                  href={`/posts/${heroPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Read Latest Post
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </Container>
        </section>

        {/* Featured Post */}
        {heroPost && (
          <Container>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Featured Post
            </h2>
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          </Container>
        )}

        {/* More Stories */}
        {posts.length > 0 && (
          <Container>
            <MoreStories posts={posts} />
          </Container>
        )}

        <Suspense>
        </Suspense>
        
        <Footer />
      </Layout>
    </>
  )
}
