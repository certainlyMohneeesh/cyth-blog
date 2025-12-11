import { LiveQueryProvider } from '@sanity/preview-kit'
import { getClient } from 'lib/sanity.client'
import { memo, useMemo } from 'react'

function PreviewProvider({
  children,
  perspective,
  token,
}: {
  children: React.ReactNode
  perspective: string | null
  token: string
}) {
  const client = useMemo(() => getClient().withConfig({ stega: true }), [])
  return (
    <LiveQueryProvider
      client={client as any}
      perspective={
        typeof perspective === 'string' ? perspective.split(',') : undefined
      }
      token={token}
    >
      {children}
    </LiveQueryProvider>
  )
}

export default memo(PreviewProvider)
