import { Auth } from '../generated/bookstore';

export const defaultValueData = {
  addBookName: '',
  addBookAuthor: '',
  addBookTopic: 1,
};

export const defaultTopicData = {
  id: 1,
  name: '',
  code: '',
};

export const defaultBookData = {
  id: 0,
  name: '',
  author: '',
  topic: {
    ...defaultTopicData,
  },
};

export const emptyUserInfo: Auth = {
  id: 0,
  email: '',
  accessToken: '',
};
