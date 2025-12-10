import React from 'react'

interface YouTubeProps {
  value: {
    url: string
    caption?: string
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  return match ? match[1] : null
}

export function YouTube({ value }: YouTubeProps) {
  const { url, caption } = value
  const videoId = getYouTubeId(url)

  if (!videoId) {
    return (
      <div className="my-6 p-4 bg-red-50 border border-red-300 rounded text-red-700">
        Invalid YouTube URL
      </div>
    )
  }

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={caption || 'YouTube video'}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
