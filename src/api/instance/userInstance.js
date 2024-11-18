import axios from "axios";
import { userAuth } from "../login";

export const api = axios.create({
  baseURL: "http://3.37.62.216/",
});

// 서버로 요청을 보내기 전에 JWT 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 서버로부터 응답을 받은 후 특정 작업을 수행
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 시 refreshToken으로 토큰 재발급
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = userAuth.refresh({ refreshToken: refreshToken });
          const newAccessToken = response.data.result.accessToken;

          // 새로운 accessToken을 저장
          localStorage.setItem("accessToken", newAccessToken);

          // Authorization 헤더에 새로운 토큰을 설정하고 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("토큰 재발급 실패:", refreshError);
          // 만료된 refreshToken일 경우, 로그아웃 처리
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
