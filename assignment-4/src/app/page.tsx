'use client'

import BookHeader from './components/BookHeader'
import BookBody from './components/BookBody'
import { AppContextProvider } from './context/AppContext'

export default function Home() {
  return (
    <AppContextProvider>
      <div className="min-h-screen bg-[#f7f8fa]">
        <BookHeader />
        <BookBody />
      </div>
    </AppContextProvider>
  )
}
