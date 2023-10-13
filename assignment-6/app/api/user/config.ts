import axios from 'axios';
import { BASE_URL } from '../../constants/url';
import { userLocalStorage } from './localService';

const accessToken = userLocalStorage.get()?.accessToken;
export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default function configureAxios(
  editLoadingTrue: () => void,
  editLoadingFalse: () => void
) {
  https.interceptors.request.use(
    function (config) {
      editLoadingTrue();
      return config;
    },
    function (err) {
      editLoadingFalse();
      return Promise.reject(err);
    }
  );

  https.interceptors.response.use(
    function (res) {
      editLoadingFalse();
      return res;
    },
    function (err) {
      editLoadingFalse();
      return Promise.reject(err);
    }
  );
}
