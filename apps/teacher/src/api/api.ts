import { DefaultApi } from "node-client";
import { Configuration } from "node-client";
import axiosBackendClient from "../axios/axios-client";

const configuration = new Configuration({
  //   basePath: window.location.origin,
  basePath: "http://localhost:3000",
});

export const api = new DefaultApi(configuration, undefined, axiosBackendClient);
