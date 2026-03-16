import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import socket from "../../services/socket"
import {
  registerAPI,
  loginAPI,
  logoutAPI,
  getMeAPI,
  resendVerificationAPI,
  googleAuthAPI,
} from "./authAPI";

// Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerAPI(userData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials)
      socket.connect()
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutAPI()
      socket.disconnect()
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      return await getMeAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async ({ email }, { rejectWithValue }) => {
    try {
      return await resendVerificationAPI({ email });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification email"
      );
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (code, { rejectWithValue }) => {
    try {
      return await googleAuthAPI(code);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google authentication failed"
      );
    }
  }
);

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Helpers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state) => {
        // Don't set isAuthenticated — user must verify email first
        state.loading = false;
      })
      .addCase(registerUser.rejected, handleRejected);

    // Login
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, handleRejected);

    // Logout
    builder
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, handleRejected);

    // Get Me
    builder
      .addCase(getMe.pending, handlePending)
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        // cookie expired or invalid — silently reset
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Resend Verification
    builder
      .addCase(resendVerification.pending, handlePending)
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendVerification.rejected, handleRejected);

    // Google Auth
    builder
      .addCase(googleAuth.pending, handlePending)
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(googleAuth.rejected, handleRejected);
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;