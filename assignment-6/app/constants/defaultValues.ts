import IUser from '../interfaces/IUser';

export const defaultValueData = {
  addBookName: '',
  addBookAuthor: '',
  addBookTopic: '',
};

export const defaultTopicData = {
  id: 0,
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

export const emptyUserInfo: IUser = {
  id: '',
  email: '',
  accessToken: '',
};
