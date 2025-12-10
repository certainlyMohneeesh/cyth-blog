import AlertBanner from 'components/AlertBanner'

export default function BlogLayout({
  preview,
  loading,
  children,
}: {
  preview: boolean
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <AlertBanner preview={preview} loading={loading} />
      <main>{children}</main>
    </div>
  )
}
