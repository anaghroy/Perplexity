import axiosInstance from "../../services/axiosInstance.js";

export const registerAPI = async ({ username, email, password }) => {
   console.log("Registering with:", { username, email, password })
  const response = await axiosInstance.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const loginAPI = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};

export const getMeAPI = async () => {
  const response = await axiosInstance.get("/api/auth/get-me");
  return response.data;
};

export const resendVerificationAPI = async ({ email }) => {
  const response = await axiosInstance.post("/api/auth/resend-verification", {
    email,
  });
  return response.data;
};

export const googleAuthAPI = async (code) => {
  const response = await axiosInstance.post("/api/auth/google", { code });
  return response.data;
};