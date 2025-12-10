'use client'

import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { useState } from 'react'
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '../src/components/ui/disclosure'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Omit<Post, '_id'>) {
  const [isOpen, setIsOpen] = useState(false)

  const imageVariants = {
    collapsed: { scale: 1, filter: 'blur(0px)' },
    expanded: { scale: 1.05, filter: 'blur(2px)' },
  }

  const contentVariants = {
    collapsed: { opacity: 0, y: 0 },
    expanded: { opacity: 1, y: 0 },
  }

  const transition = {
    type: 'spring' as const,
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative h-[400px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <motion.div
          animate={isOpen ? 'expanded' : 'collapsed'}
          variants={imageVariants}
          transition={transition}
          className="relative h-[400px] w-full overflow-hidden"
        >
          <CoverImage
            slug={slug}
            title={title}
            image={coverImage}
            priority={false}
          />
        </motion.div>
      </div>
      
      <Disclosure
        onOpenChange={setIsOpen}
        open={isOpen}
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-gray-950 px-6 pt-4 shadow-2xl border-t border-gray-200 dark:border-gray-800"
        variants={contentVariants}
        transition={transition}
      >
        <DisclosureTrigger>
          <button
            className="w-full pb-3 text-left"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              {title}
            </h3>
            {date && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <Date dateString={date} />
              </div>
            )}
          </button>
        </DisclosureTrigger>
        
        <DisclosureContent>
          <div className="flex flex-col pb-6 space-y-4">
            {excerpt && (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {excerpt}
              </p>
            )}
            
            {author && (
              <div className="flex items-center gap-3">
                <Avatar name={author.name} picture={author.picture} />
              </div>
            )}
            
            <Link
              href={`/posts/${slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-gray-900 transition-all hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-[1.02] active:scale-95"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </DisclosureContent>
      </Disclosure>
    </motion.div>
  )
}
