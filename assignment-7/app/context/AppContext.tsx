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
import { defaultValueData, emptyUserInfo } from '../constants/defaultValues';
import axios from 'axios';
import { BASE_URL } from '../constants/url';
import { userLocalStorage } from '../api/user/localService';
import { Book, Topic, Auth } from '../generated/bookstore';

interface AppContextInfo {
  addBookName: string;
  addBookAuthor: string;
  addBookTopic: number | string;
}

interface AppContextData {
  appSummaryInfo: AppContextInfo;
  updateInfo: AppContextInfo;
  isLightMode: boolean;
  dataChanged: boolean;
  searchValue: string;
  currentPage: number;
  loading: boolean;
  userInfo: Auth;
  bookTopics: Topic[] | undefined;
  editInputValue: (fieldName: string, value: string) => void;
  editSearchValue: (value: string) => void;
  editCurrentPage: (value: number) => void;
  resetInputValue: () => void;
  editLoadingTrue: () => void;
  editLoadingFalse: () => void;
  setUserLogin: (data: Auth) => void;
  putInfoToInputs: (data: Book) => void;
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

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [loading, setLoading] = useState(true);
  const [bookTopics, setBookTopics] = useState<Topic[]>();
  const [userInfo, setUserInfo] = useState<Auth>(emptyUserInfo);
  useEffect(() => {
    const storedUserInfo = userLocalStorage.get();
    if (storedUserInfo?.accessToken !== undefined) {
      setUserInfo({ ...storedUserInfo });
    }
  }, []);
  useEffect(() => {
    const data = userLocalStorage.get();
    axios
      .get(`${BASE_URL}/topics`, {
        headers: {
          Authorization: 'Bearer ' + data?.accessToken,
        },
      })
      .then((res) => {
        setBookTopics(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const setUserLogin = (data: Auth) => {
    setUserInfo(data);
    userLocalStorage.set(data);
  };
  const [appSummaryInfo, setAppSummaryInfo] = useState({ ...defaultValueData });
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
  const editInputValue = (fieldName: string, value: string | number) => {
    setAppSummaryInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
    setUpdateInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  const putInfoToInputs = useCallback((data: Book) => {
    editInputValue('addBookName', data.name);
    editInputValue('addBookAuthor', data.author || '');
    editInputValue('addBookTopic', data.topic?.id || 1);
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
      userInfo,
      bookTopics,
      setUserLogin,
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
      userInfo,
      bookTopics,
      editCurrentPage,
      editSearchValue,
      putInfoToInputs,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
