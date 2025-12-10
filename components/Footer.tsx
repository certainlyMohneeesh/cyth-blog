import Container from 'components/BlogContainer'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Inspired by{' '}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              tailwindcss.com
            </a>
            {' & '}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              ui.shadcn.com
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Built by{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              CythicalLabs
            </a>
            . The source code is available on{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}