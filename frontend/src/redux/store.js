import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../redux/theme/themeSlice.js";
import authReducer from "../features/auth/authSlice.js";
import chatReducer from "../features/chat/chatSlice.js"

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});
