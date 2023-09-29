import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { BOOK_TYPES } from '../constants/bookTypes'

interface AppContextInfo {
  addBookName: string
  addBookAuthor: string
  addBookTopic: string
  searchValue: string
}

interface AppContextData {
  appSummaryInfo: AppContextInfo
  isLightMode: boolean
  dataChanged: boolean
  editInputValue: (fieldName: string, value: string) => void
  resetInputValue: () => void
  changeLightDarkMode: (isLightMode: boolean) => void
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

const defaultValueData = {
  addBookName: '',
  addBookAuthor: '',
  addBookTopic: BOOK_TYPES[0],
  searchValue: '',
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [appSummaryInfo, setAppSummaryInfo] = useState({
    ...defaultValueData,
  })
  const [dataChanged, setDataChanged] = useState(false)
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('isLightMode')
    return storedMode !== 'dark'
  })

  const editInputValue = (fieldName: string, value: string) => {
    setAppSummaryInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  }

  const resetInputValue = () => {
    setAppSummaryInfo({
      ...defaultValueData,
    })
  }

  const changeLightDarkMode = (newIsLightMode: boolean) => {
    setIsLightMode(newIsLightMode)
    localStorage.setItem('isLightMode', newIsLightMode ? 'light' : 'dark')
  }

  const changeDataChanged = (newDataChanged: boolean) => {
    setDataChanged(newDataChanged)
  }

  const contextValue = useMemo(
    () => ({
      appSummaryInfo,
      isLightMode,
      dataChanged,
      editInputValue,
      resetInputValue,
      changeLightDarkMode,
      changeDataChanged,
    }),
    [appSummaryInfo, isLightMode, dataChanged],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
