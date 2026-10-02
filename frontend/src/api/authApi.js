import axiosClient from "./axiosClient";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload),
  login: (payload) => axiosClient.post("/auth/login", payload),
  logout: () => axiosClient.post("/auth/logout"),
  getCurrentUser: () => axiosClient.get("/auth/current-user"),
  verifyEmail: (token) => axiosClient.get(`/auth/verify-email/${token}`),
  resendVerification: () => axiosClient.post("/auth/resend-email-verification"),
  forgotPassword: (payload) =>
    axiosClient.post("/auth/forgot-password", payload),
  resetPassword: (token, payload) =>
    axiosClient.post(`/auth/reset-password/${token}`, payload),
  changePassword: (payload) =>
    axiosClient.post("/auth/change-password", payload),
};
