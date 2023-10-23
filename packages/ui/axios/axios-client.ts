import axios, { AxiosRequestConfig } from "axios";

// export const axiosBaseUrl = `${process.env.REACT_APP_BACKEND_SCHEMA}://${process.env.REACT_APP_BACKEND_HOSTNAME}:${process.env.REACT_APP_BACKEND_PORT}`;

export const axiosBaseUrl = `http://localhost:3000`
export const axiosConfig: AxiosRequestConfig = {
  baseURL: axiosBaseUrl,
  withCredentials: true
};

const axiosBackendClient = axios.create(axiosConfig);

export default axiosBackendClient;
