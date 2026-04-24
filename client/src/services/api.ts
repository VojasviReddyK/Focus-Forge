import axios from "axios";

// ✅ Correct base URL handling
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("focus_forge_access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (REFRESH TOKEN LOGIC)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(
        "focus_forge_refresh"
      );

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          // Save new tokens
          localStorage.setItem(
            "focus_forge_access",
            data.accessToken
          );
          localStorage.setItem(
            "focus_forge_refresh",
            data.refreshToken
          );

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails → logout
          localStorage.removeItem("focus_forge_access");
          localStorage.removeItem("focus_forge_refresh");
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);