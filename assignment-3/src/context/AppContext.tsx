import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react'

interface AppContextData {
  addBookName: string
  addBookAuthor: string
  addBookTopic: string
  isLightMode: boolean
  searchValue: string
  dataChanged: boolean
  changeLightDarkMode: (isLightMode: boolean) => void
  editSearchValue: (searchValue: string) => void
  changeAddBookName: (addBookName: string) => void
  changeAddBookAuthor: (addBookAuthor: string) => void
  changeAddBookTopic: (addBookTopic: string) => void
  changeDataChanged: (dataChanged: boolean) => void
}

const AppContext = createContext<AppContextData | undefined>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider')
  }
  return context
}

interface AppContextProviderProps {
  children: ReactNode
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [addBookName, setAddBookName] = useState('')
  const [addBookAuthor, setAddBookAuthor] = useState('')
  const [addBookTopic, setAddBookTopic] = useState('')
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('isLightMode')
    return storedMode !== 'dark'
  })
  const [searchValue, setSearchValue] = useState('')
  const [dataChanged, setDataChanged] = useState(false)

  const changeLightDarkMode = (newIsLightMode: boolean) => {
    setIsLightMode(newIsLightMode)
    localStorage.setItem('isLightMode', newIsLightMode ? 'light' : 'dark')
  }

  const editSearchValue = (newSearchValue: string) => {
    setSearchValue(newSearchValue)
  }

  const changeAddBookName = (newAddBookName: string) => {
    setAddBookName(newAddBookName)
  }

  const changeAddBookAuthor = (newAddBookAuthor: string) => {
    setAddBookAuthor(newAddBookAuthor)
  }

  const changeAddBookTopic = (newAddBookTopic: string) => {
    setAddBookTopic(newAddBookTopic)
  }

  const changeDataChanged = (newDataChanged: boolean) => {
    setDataChanged(newDataChanged)
  }

  const contextValue = useMemo(
    () => ({
      addBookName,
      addBookAuthor,
      addBookTopic,
      isLightMode,
      searchValue,
      dataChanged,
      changeLightDarkMode,
      editSearchValue,
      changeAddBookName,
      changeAddBookAuthor,
      changeAddBookTopic,
      changeDataChanged,
    }),
    [
      addBookName,
      addBookAuthor,
      addBookTopic,
      isLightMode,
      searchValue,
      dataChanged,
    ],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
