import { action, createStore } from "easy-peasy";

export const store = createStore({
  isLightMode: true,
  searchValue: "",
  changeLightDarkMode: action((state, payload) => {
    state.isLightMode = payload;
  }),
  editSearchValue: action((state, payload) => {
    state.searchValue = payload;
  }),
});
