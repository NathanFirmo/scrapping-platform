import type { Metadata } from 'next'
import { RootStyleRegistry } from './components'
import './global.css'

export const metadata: Metadata = {
  title: 'Brand Monitor',
  description:
    'Tenha sua marca monitorada 24 horas por dia e elimine seus concorrentes desleais. Conheça! Proteja sua marca com nossa solução especializada.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}
