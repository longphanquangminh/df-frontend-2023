'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BOOK_TYPES } from '../constants/bookTypes';
import IBook from 'app/interfaces/IBook';

interface AppContextInfo {
  addBookName: string;
  addBookAuthor: string;
  addBookTopic: string;
}

interface AppContextData {
  appSummaryInfo: AppContextInfo;
  updateInfo: AppContextInfo;
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
  putInfoToInputs: (data: IBook) => void;
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
  const [loading, setLoading] = useState(true);
  const [appSummaryInfo, setAppSummaryInfo] = useState({
    ...defaultValueData,
  });
  const [updateInfo, setUpdateInfo] = useState({
    ...defaultValueData,
  });
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get('q') || ''
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataChanged, setDataChanged] = useState(false);
  const editLoadingTrue = () => {
    setLoading(true);
  };
  const editLoadingFalse = () => {
    setLoading(false);
  };
  const [isLightMode, setIsLightMode] = useState(false);
  useEffect(() => {
    const storedMode = window.localStorage.getItem('isLightMode');
    if (storedMode !== 'dark') {
      setIsLightMode(true);
    }
  }, []);
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
    setUpdateInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  const putInfoToInputs = useCallback((data: IBook) => {
    editInputValue('addBookName', data.name);
    editInputValue('addBookAuthor', data.author);
    editInputValue('addBookTopic', data.topic);
  }, []);

  const resetInputValue = () => {
    setAppSummaryInfo({
      ...defaultValueData,
    });
    setUpdateInfo({
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
      updateInfo,
      editInputValue,
      resetInputValue,
      changeLightDarkMode,
      changeDataChanged,
      editCurrentPage,
      editSearchValue,
      editLoadingTrue,
      editLoadingFalse,
      putInfoToInputs,
    }),
    [
      appSummaryInfo,
      isLightMode,
      dataChanged,
      searchValue,
      currentPage,
      loading,
      updateInfo,
      editCurrentPage,
      editSearchValue,
      putInfoToInputs,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
