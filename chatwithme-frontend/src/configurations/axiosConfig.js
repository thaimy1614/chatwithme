import axios from "axios";
import {
  getToken,
  removeToken,
  removeUserInfo,
  setToken,
} from "../services/localStorageService";
import { refreshToken } from "../services/ChatService";

axios.defaults.baseURL = import.meta.env.VITE_API_PREFIX || "http://localhost:8080/api";
axios.defaults.withCredentials = true;

// Hàm xử lý logout
const handleLogout = async () => {
  removeToken();
  removeUserInfo();
  window.location.href = "/login";
};

// Hàm làm mới token
const handleTokenRefresh = async () => {
  const newToken = await refreshToken(getToken());
  if (!newToken) {
    console.error("Failed to refresh token, redirecting to login");
    await handleLogout();
    return null;
  }
  console.log("New token: ", newToken);
  setToken(newToken);
  return newToken;
};

axios.interceptors.response.use(
  async (response) => {
    if (response.data?.code === 1006) {
      // Kiểm tra nếu là yêu cầu refresh token
      if (response.config.url === "/user/refresh") {
        console.error("Failed to refresh token, redirecting to login");
        await handleLogout();
        return Promise.reject(new Error("Token refresh failed"));
      }

      // Làm mới token cho các yêu cầu khác
      const newToken = await handleTokenRefresh();
      if (newToken) {
        response.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(response.config);
      }
    }

    return response;
  },
  (error) => {
    if (error.response?.data?.code === 1006) {
      console.error("Token hết hạn, điều hướng đến trang đăng nhập");
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default axios;
