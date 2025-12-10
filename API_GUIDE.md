# Blog API Documentation

## Overview
This API allows you to fetch all blog posts from your CythBlog and display them on external websites like your portfolio.

## Endpoint

### GET `/api/v1/posts`

Fetches all blog posts with complete metadata including author avatars, cover images, and direct links.

**Base URLs:**
- Local: `http://localhost:3000/api/v1/posts`
- Production: `https://your-domain.com/api/v1/posts`

---

## Response Format

The API returns a JSON array of post objects:

```json
[
  {
    "title": "Post Title",
    "slug": "post-slug",
    "excerpt": "Brief description of the post...",
    "date": "2025-06-01T00:00:00.000Z",
    "link": "https://your-blog.com/posts/post-slug",
    "coverImage": "https://cdn.sanity.io/images/project/dataset/hash-widthxheight.jpg",
    "author": {
      "name": "Author Name",
      "avatar": "https://cdn.sanity.io/images/project/dataset/hash-widthxheight.jpg"
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | The post title |
| `slug` | string | URL-friendly identifier |
| `excerpt` | string | Short description/preview |
| `date` | string (ISO 8601) | Publication date |
| `link` | string | Full URL to the post |
| `coverImage` | string \| null | Absolute URL to cover image |
| `author.name` | string | Author's name |
| `author.avatar` | string \| null | Absolute URL to author's profile picture |

---

## Features

✅ **CORS Enabled** - Can be fetched from any domain  
✅ **Sorted by Date** - Most recent posts first  
✅ **Image URLs Resolved** - All Sanity images converted to CDN URLs  
✅ **Direct Links** - Full URLs to blog posts included  
✅ **Author Avatars** - Profile pictures fetched and resolved  

---

## Usage Examples

### 1. Vanilla JavaScript (Fetch API)

```javascript
fetch('https://your-blog.com/api/v1/posts')
  .then(response => response.json())
  .then(posts => {
    console.log('Blog posts:', posts)
    // Use the posts data here
  })
  .catch(error => console.error('Error:', error))
```

### 2. React/Next.js Component

```tsx
'use client'

import { useEffect, useState } from 'react'

interface Post {
  title: string
  slug: string
  excerpt: string
  date: string
  link: string
  coverImage: string | null
  author: {
    name: string
    avatar: string | null
  } | null
}

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://your-blog.com/api/v1/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch posts:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading posts...</div>

  return (
    <section className="py-16">
      <h2 className="mb-8 text-3xl font-bold">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-4">
              {/* Title */}
              <h3 className="mb-2 text-xl font-bold line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-3">
                {post.author?.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-900">
                    {post.author?.name || 'Unknown Author'}
                  </p>
                  <p>{new Date(post.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
```

### 3. Server-Side Rendering (Next.js)

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const response = await fetch('https://your-blog.com/api/v1/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  const posts = await response.json()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
```

### 4. Vue.js Component

```vue
<template>
  <div class="blog-section">
    <h2>Latest Blog Posts</h2>
    <div class="posts-grid">
      <a
        v-for="post in posts"
        :key="post.slug"
        :href="post.link"
        target="_blank"
        rel="noopener noreferrer"
        class="post-card"
      >
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" />
        <div class="post-content">
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt }}</p>
          <div class="author-info">
            <img v-if="post.author?.avatar" :src="post.author.avatar" :alt="post.author.name" />
            <span>{{ post.author?.name }}</span>
            <span>{{ formatDate(post.date) }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])

onMounted(async () => {
  const response = await fetch('https://your-blog.com/api/v1/posts')
  posts.value = await response.json()
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>
```

---

## Implementation Details

### What Was Changed:

1. **`lib/sanity.queries.ts`**
   - Exported `postFields` (was private before)
   - Added `allPostsQuery` to fetch all posts sorted by date

2. **`pages/api/v1/posts.ts`** (NEW FILE)
   - Created API route handler
   - Enabled CORS for cross-origin requests
   - Fetches posts from Sanity
   - Resolves image URLs using `urlForImage()`
   - Constructs full post links
   - Returns clean JSON format

### How It Works:

1. **Client Request** → API endpoint (`/api/v1/posts`)
2. **API Handler** → Fetches data from Sanity CMS
3. **Image Resolution** → Converts Sanity image objects to CDN URLs
4. **URL Construction** → Builds absolute links to posts
5. **Response** → Returns formatted JSON with all metadata

---

## Testing

### Test Locally

```bash
curl http://localhost:3000/api/v1/posts | jq
```

### Test in Browser
Open: `http://localhost:3000/api/v1/posts`

### Expected Response
You should see an array of post objects with all fields populated.

---

## Troubleshooting

**Issue:** CORS errors when fetching from portfolio
- **Solution:** The API already has CORS enabled. Make sure you're using the correct URL.

**Issue:** Images not loading
- **Solution:** Check that Sanity images are published and accessible.

**Issue:** Empty array returned
- **Solution:** Ensure you have published posts in your Sanity Studio.

**Issue:** `link` field shows `http://localhost:3000`
- **Solution:** Set `NEXT_PUBLIC_VERCEL_URL` environment variable in production.

---

## Environment Variables (Production)

For production deployment, add:

```env
NEXT_PUBLIC_VERCEL_URL=your-blog.com
```

This ensures the `link` field in the API response uses your production domain.

---

## Rate Limiting

Currently, there's no rate limiting. Consider adding rate limiting in production using:
- Vercel Edge Config
- Upstash Rate Limiting
- Custom middleware

---

## Future Enhancements

Possible additions:
- Pagination (`?page=1&limit=10`)
- Filtering by date range (`?from=2025-01-01&to=2025-12-31`)
- Search functionality (`?q=searchterm`)
- Category/tag filtering (`?tag=javascript`)

---

## Security Notes

✅ Read-only endpoint (GET only)  
✅ No authentication required (public blog posts)  
✅ CORS enabled for all origins  
⚠️ Consider adding rate limiting for production  

---

## Support

For issues or questions:
1. Check the [Sanity documentation](https://www.sanity.io/docs)
2. Review Next.js API routes documentation
3. Check browser console for errors

---

**Created:** December 10, 2025  
**Version:** 1.0.0  
**API Path:** `/api/v1/posts`
