import axios from "axios";
import { timeToSeconds } from "./time";
import eventBus from "./eventBus";

const baseURL = `${import.meta.env.VITE_API_URL}/api`;
const defaultTimeout = 10 * 60 * 1000; // 10 minutes
export const csrApi = axios.create({
  baseURL,
  timeout: defaultTimeout,
  withCredentials: true,
});

// Helper: retry GET requests based on request config
const retryRequest = async (error) => {
  const config = error.config;
  const retries = config.retry ?? 2;

  if (!config || config.__retryCount >= retries || config.method !== "get") {
    return null;
  }

  config.__retryCount = (config.__retryCount || 0) + 1;
  try {
    return await csrApi(config);
  } catch (err) {
    return retryRequest(err);
  }
};

// Axios response interceptor
csrApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config;

    if (error.response) {
      console.log("🚀 ~ error.response.status:", error.response.status);
      switch (error.response.status) {
        case 400:
          return Promise.reject({
            message: "Bad Request",
            ...error.response.data,
          });
        case 401:
          return Promise.reject({
            message: "Unauthorized Access",
            ...error.response.data,
          });
        case 403:
          const channel = new BroadcastChannel("auth_channel");
          channel.postMessage({ massage: "logout", path: "/log-in" });
      //    await SessionExpire().catch(() => {});
          return Promise.reject({
            message: "session expired",
            ...error.response.data,
            logout: true,
          });
        case 404:
          return Promise.reject({
            message: "Resource Not Found",
            ...error.response.data,
          });
        case 500:
          return Promise.reject({
            message: "Something went wrong",
            ...error.response.data,
          });
        case 505:
          console.log("down");
          eventBus.emit("server-down", true);
          console.log("down 2 ");
          return Promise.reject({
            message: "Something went wrong",
            ...error.response.data,
          });
        default:
          return Promise.reject({
            message: "An Error Occurred",
            ...error.response.data,
          });
      }
    } else if (error.request) {
      const retriedResponse = await retryRequest(error);
      if (retriedResponse) return retriedResponse;

      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
      if (isOffline) {
        eventBus.emit("offline-mode", true);
      } else {
        eventBus.emit("server-down", true);
      }
      return Promise.reject({
        message: isOffline ? "You are offline" : "No Response Received",
        errorBoundary: !isOffline,
        offline: isOffline,
      });
    } else {
      return Promise.reject({
        message: "Request Error",
        details: error.message,
      });
    }
  },
);

/**
 * Makes an API request with SSR support and retry logic.
 *
 * @param {string} url - API endpoint relative to baseURL.
 * @param {Object} [options={}]
 * @param {string} [options.method="GET"]
 * @param {Object} [options.body]
 * @param {Object} [options.next]
 * @param {number} [options.timeout=20000]
 * @param {number} [options.retry=0]
 * @returns {Promise<Object>}
 */
export const ssrApi = async (url, options = {}) => {
  const {
    method = "GET",
    body,
    next = {},
    cache,
    timeout = 20000,
    retry = 0,
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt <= retry) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${baseURL}${url}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache,
        next:
          process.env.NEXT_PUBLIC_MODE === "dev"
            ? { revalidate: 0 }
            : {
                ...next,
                revalidate: next.revalidate
                  ? timeToSeconds(next.revalidate)
                  : undefined,
              },
      });

      clearTimeout(id);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "An error occurred" }));
        throw errorData;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(id);
      lastError = error;

      const isAbort = error?.name === "AbortError";
      const isRetriable = !isAbort && attempt < retry;

      if (!isRetriable || error?.code === 505) {
        throw isAbort
          ? { message: "Request Timeout", errorBoundary: true }
          : { message: "Request Error", details: error.message };
      }

      attempt++;
    }
  }

  throw lastError;
};

class AppError extends Error {
  constructor(e) {
    super(JSON?.stringify(e));
  }
}

export function AsyncHandler(fn, { ssr = false, onError = "throw" } = {}) {
  return (...args) => {
    return fn(...args).catch((error) => {
      let errorssr = new AppError(error);
      if (onError === "throw") {
        throw ssr ? errorssr : error;
      } else {
        return onError(error, ...args);
      }
    });
  };
}
