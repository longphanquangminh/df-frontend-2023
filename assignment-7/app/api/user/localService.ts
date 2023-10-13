import IUser from '../../interfaces/IUser';

export const userLocalStorage = {
  get: (): IUser | null => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(window.localStorage.getItem('USER') || '{}');
  },
  set: (user: IUser): void => {
    window.localStorage.setItem('USER', JSON.stringify(user));
  },
  remove: (): void => {
    window.localStorage.removeItem('USER');
  },
};
