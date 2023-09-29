import {
  Action,
  FilterActionTypes,
  StateMapper,
  action,
  createStore,
  createTypedHooks,
} from 'easy-peasy'
import { BOOK_TYPES } from '../constants/bookTypes'

export interface BookModel {
  addBookName: string
  addBookAuthor: string
  addBookTopic: string
  isLightMode: boolean
  searchValue: string
  dataChanged: boolean
  changeLightDarkMode: Action<BookModel, boolean>
  editSearchValue: Action<BookModel, string>
  changeAddBookName: Action<BookModel, string>
  changeAddBookAuthor: Action<BookModel, string>
  changeAddBookTopic: Action<BookModel, string>
  changeDataChanged: Action<BookModel, boolean>
}
const typedHooks = createTypedHooks<BookModel>()

export const { useStoreActions, useStoreState } = typedHooks

export const store = createStore({
  addBookName: '',
  addBookAuthor: '',
  addBookTopic: BOOK_TYPES[0],
  isLightMode: localStorage.getItem('isLightMode') !== 'dark',
  searchValue: '',
  dataChanged: false,
  changeLightDarkMode: action(
    (state: StateMapper<FilterActionTypes<{ isLightMode }>>, payload) => {
      const result = payload ? 'light' : 'dark'
      localStorage.setItem('isLightMode', result)
      state.isLightMode = payload
    },
  ),
  editSearchValue: action(
    (state: StateMapper<FilterActionTypes<{ searchValue }>>, payload) => {
      state.searchValue = payload
    },
  ),
  changeAddBookName: action(
    (state: StateMapper<FilterActionTypes<{ addBookName }>>, payload) => {
      state.addBookName = payload
    },
  ),
  changeAddBookAuthor: action(
    (state: StateMapper<FilterActionTypes<{ addBookAuthor }>>, payload) => {
      state.addBookAuthor = payload
    },
  ),
  changeAddBookTopic: action(
    (state: StateMapper<FilterActionTypes<{ addBookTopic }>>, payload) => {
      state.addBookTopic = payload
    },
  ),
  changeDataChanged: action(
    (state: StateMapper<FilterActionTypes<{ dataChanged }>>, payload) => {
      state.dataChanged = payload
    },
  ),
})
