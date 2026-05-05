import axios from "axios";

/* BASE INSTANCE */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

/* TOKEN HELPERS */

const getToken = () => localStorage.getItem("accessToken");

const setToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  }
};

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/* REQUEST INTERCEPTOR */

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* REFRESH CONTROL */

let isRefreshing = false;
let subscribers = [];

const subscribe = (cb) => subscribers.push(cb);

const notifySubscribers = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

/* RESPONSE INTERCEPTOR */

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    if (error.response.status !== 401) return Promise.reject(error);

    if (originalRequest._retry) {
      clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribe((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(API(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("🔄 Refreshing token...");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data.accessToken;

      if (!newToken) throw new Error("No token received");

      setToken(newToken);

      API.defaults.headers.Authorization = `Bearer ${newToken}`;

      notifySubscribers(newToken);

      return API(originalRequest);
    } catch (err) {
      console.error("Refresh failed:", err);
      clearAuth();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;