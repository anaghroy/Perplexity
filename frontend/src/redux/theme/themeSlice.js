import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("app-theme") || "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";

      localStorage.setItem("app-theme", state.theme);
      document.documentElement.setAttribute("data-theme", state.theme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;