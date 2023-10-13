'use client';

import configureAxios from '../api/user/config';
import { useAppContext } from '../context/AppContext';

export default function AxiosSetup() {
  const { editLoadingTrue, editLoadingFalse } = useAppContext();
  configureAxios(editLoadingTrue, editLoadingFalse);
  return null;
}
