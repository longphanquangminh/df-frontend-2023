import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppContextProvider } from './context/AppContext'
import Loading from './components/Loading'
import BookHeader from './components/BookHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Book Store',
  description: 'Book Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          <Loading />
          <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
            <div>
              <BookHeader />
            </div>
            <div className="flex-1 p-3">{children}</div>
          </div>
        </AppContextProvider>
      </body>
    </html>
  )
}
