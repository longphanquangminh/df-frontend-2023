'use client'

import BookHeader from './components/BookHeader'
import BookBody from './components/BookBody'
import { AppContextProvider } from './context/AppContext'

export default function Home() {
  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
        <div>
          <BookHeader />
        </div>
        <div className="flex-1">
          <BookBody />
        </div>
      </div>
    </AppContextProvider>
  )
}
