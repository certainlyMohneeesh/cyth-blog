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
import {TextLoop} from '../src/components/ui/text-loop'

import Image from 'next/image'

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
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Ambient Background Elements */}
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

          <Container>
            <div className="grid items-center gap-12 md:grid-cols-12">
              {/* Content Side - Spans 7 columns */}
              <div className="flex flex-col items-start text-left md:col-span-7">
                {/* Status Badge */}
                <Link href="https://cyth.dev" className="mb-6 flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    Cythical Labs
                  </span>
                </Link>

                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                  {title}
                </h1>

                <div className="mb-8 flex flex-wrap items-center gap-x-3 text-3xl font-bold text-muted-foreground md:text-4xl lg:text-5xl">
                  <span>Exploring</span>
                  <TextLoop className="text-primary" interval={3}>
                    <span>Code</span>
                    <span>Design</span>
                    <span>Innovation</span>
                    <span>Life</span>
                  </TextLoop>
                </div>

                <div className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  <PortableText value={description} />
                </div>

                {heroPost && (
                  <Link
                    href={`/posts/${heroPost.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                  >
                    Read Latest Post
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              {/* Visual Side - Spans 5 columns */}
              <div className="relative flex justify-center md:col-span-5 md:justify-end">
                {/* Decorative Glow */}
                <div className="absolute inset-0 scale-90 transform rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-2xl" />
                
                <Image
                  src="/cythblog-lightmode.png"
                  alt="CythBlog Logo"
                  width={500}
                  height={500}
                  className="relative z-10 h-auto w-64 drop-shadow-2xl transition-transform duration-500 hover:scale-105 dark:invert md:w-full md:max-w-[400px]"
                  priority
                />
              </div>
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
