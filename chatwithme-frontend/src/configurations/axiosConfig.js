import axios from "axios";
import {
  getToken,
  removeToken,
  removeUserInfo,
  setIoStreamToken,
  setToken,
  setUserInfo,
} from "../services/localStorageService";
import { refreshToken } from "../services/ChatService";
import { fetchUserInfo } from "../Layout/Login";

axios.defaults.baseURL = import.meta.env.VITE_API_PREFIX || "http://localhost:8080/api";
axios.defaults.withCredentials = true;

// Hàm xử lý logout
const handleLogout = async () => {
  removeToken();
  removeUserInfo();
  setTimeout(() => {
  window.location.href = "/login";
  }, 5000);
};

// Hàm làm mới token
const handleTokenRefresh = async () => {
  const {token, ioStreamToken} = await refreshToken(getToken());
  if (!token) {
    console.error("Failed to refresh token, redirecting to login");
    await handleLogout();
    return null;
  }
  console.log("New token: ", token);
  setToken(token);
  setIoStreamToken(ioStreamToken);

  const newUser = await fetchUserInfo();
  setUserInfo(newUser);
  return token;
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
