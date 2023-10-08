'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BOOK_TYPES } from '../constants/bookTypes';

interface AppContextInfo {
  addBookName: string;
  addBookAuthor: string;
  addBookTopic: string;
}

interface AppContextData {
  appSummaryInfo: AppContextInfo;
  isLightMode: boolean;
  dataChanged: boolean;
  searchValue: string;
  currentPage: number;
  loading: boolean;
  editInputValue: (fieldName: string, value: string) => void;
  editSearchValue: (value: string) => void;
  editCurrentPage: (value: number) => void;
  resetInputValue: () => void;
  editLoadingTrue: () => void;
  editLoadingFalse: () => void;
  changeLightDarkMode: (isLightMode: boolean) => void;
  changeDataChanged: (dataChanged: boolean) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const defaultValueData = {
  addBookName: '',
  addBookAuthor: '',
  addBookTopic: BOOK_TYPES[0],
};

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [appSummaryInfo, setAppSummaryInfo] = useState({
    ...defaultValueData,
  });
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get('q') || ''
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataChanged, setDataChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const editLoadingTrue = () => {
    setLoading(true);
  };
  const editLoadingFalse = () => {
    setLoading(false);
  };
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = window.localStorage.getItem('isLightMode');
      return storedMode !== 'dark';
    }
    return true;
  });
  const router = useRouter();
  const editSearchValue = useCallback(
    (value: string) => {
      setSearchValue(value);
      const result =
        value === '' ? '/' : `?q=${value}&page=${currentPage.toString()}`;

      router.replace(result);
    },
    [router, currentPage]
  );
  const editCurrentPage = useCallback(
    (value: number) => {
      setCurrentPage(value);
      const result =
        searchValue === '' ? '/' : `?q=${searchValue}&page=${value.toString()}`;

      router.replace(result);
    },
    [router, searchValue]
  );
  const editInputValue = (fieldName: string, value: string) => {
    setAppSummaryInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const resetInputValue = () => {
    setAppSummaryInfo({
      ...defaultValueData,
    });
  };

  const changeLightDarkMode = (newIsLightMode: boolean) => {
    setIsLightMode(newIsLightMode);
    window.localStorage.setItem(
      'isLightMode',
      newIsLightMode ? 'light' : 'dark'
    );
  };

  const changeDataChanged = (newDataChanged: boolean) => {
    setDataChanged(newDataChanged);
  };

  const contextValue = useMemo(
    () => ({
      appSummaryInfo,
      isLightMode,
      dataChanged,
      searchValue,
      currentPage,
      loading,
      editInputValue,
      resetInputValue,
      changeLightDarkMode,
      changeDataChanged,
      editCurrentPage,
      editSearchValue,
      editLoadingTrue,
      editLoadingFalse,
    }),
    [
      appSummaryInfo,
      isLightMode,
      dataChanged,
      searchValue,
      currentPage,
      loading,
      editCurrentPage,
      editSearchValue,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
