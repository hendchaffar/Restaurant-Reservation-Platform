import axios from "axios";

const setAccessToken = (config: any) => {
  const accessToken = localStorage.getItem("token");

  if (!config.headers) {
    config.headers = {};
  }

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
};

const api = axios.create();

api.interceptors.request.use(
  (config) => setAccessToken(config),
  (error) => Promise.reject(error)
);

export { api };
