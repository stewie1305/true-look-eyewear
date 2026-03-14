import axios from "axios";
import { useAuthStore } from "../features/auth/store";
import { env } from "./env";
import { API_ENDPOINTS } from "@/shared/constants";
import { toast } from "sonner";

//Create axios instance
const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000, //15s timeout
  withCredentials: true, // cho phép gửi cookie (refresh token) trong các request
});

//request Interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken; // dung getState vi ts la tinh chi lay gia tri, kh phai tsx nen kh dc dung hook, dung hook no re render

  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Response Interceptor
 *
 *
 *
 */

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const proccessQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) {
      p.resolve(token);
    } else {
      p.reject(error);
    }
  });
  failedQueue = [];
};
//response Interceptor
apiClient.interceptors.response.use(
  //xu li data BE tra
  (response) => {
    return response.data?.data !== undefined
      ? response.data.data
      : response.data;
  },

  //
  async (error) => {
    const originalRequest = error.config;
    const notAuthReqs = !originalRequest.url?.includes("auth");
    const is401 = error.response?.status === 401;
    const notRetriedYet = !originalRequest._retry;
    // tránh loop vô hạn
    if (is401 && notAuthReqs && notRetriedYet) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          //Luu resolve va reject vao queue de cho
          failedQueue.push({ resolve, reject });
          //Promise nay se treo cho toi khi
          //ProccessQueue duoc goi sau khi refresh xong
        }).then((token) => {
          //khi refresh xong,retry request nay vs token moi
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await axios.post(
          `${env.API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true },
        );
        const newToken: string =
          res.data?.data?.accessToken ?? res.data?.accessToken;
        useAuthStore.getState().setAuth({
          accessToken: newToken,
          role: useAuthStore.getState().role,
          roles: useAuthStore.getState().roles,
        });
        proccessQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        proccessQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    const message =
      error.response?.data?.message ??
      error.message ??
      "Đã có lỗi xảy ra, vui lòng thử lại"; //?? la chap nhan cho rong, rong thi chay qua cai sau
    error.message = message;
    const isLogoutEndpoint = originalRequest.url?.includes("/auth/logout");
    if (!isLogoutEndpoint) {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
