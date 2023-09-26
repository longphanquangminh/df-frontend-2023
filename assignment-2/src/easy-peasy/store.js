import { action, createStore } from "easy-peasy";
import { BOOK_TYPES } from "../constants/bookTypes";

export const store = createStore({
  addBookName: "",
  addBookAuthor: "",
  addBookTopic: BOOK_TYPES[0],
  isLightMode: true,
  searchValue: "",
  dataChanged: false,
  changeLightDarkMode: action((state, payload) => {
    state.isLightMode = payload;
  }),
  editSearchValue: action((state, payload) => {
    state.searchValue = payload;
  }),
  changeAddBookName: action((state, payload) => {
    state.addBookName = payload;
  }),
  changeAddBookAuthor: action((state, payload) => {
    state.addBookAuthor = payload;
  }),
  changeAddBookTopic: action((state, payload) => {
    state.addBookTopic = payload;
  }),
  changeDataChanged: action((state, payload) => {
    state.dataChanged = payload;
  }),
});
