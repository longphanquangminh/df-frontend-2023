import { Auth } from '../generated/orval';

export const userLocalStorage = {
  get: (): Auth | null => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(window.localStorage.getItem('USER') || '{}');
  },
  set: (user: Auth): void => {
    window.localStorage.setItem('USER', JSON.stringify(user));
  },
  remove: (): void => {
    window.localStorage.removeItem('USER');
  },
};
