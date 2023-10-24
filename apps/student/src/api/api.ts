import { DefaultApi } from "node-client/openapi/api";
import { Configuration } from "node-client";
import axiosBackendClient from "../axios/axios-client";
const configuration = new Configuration({
  basePath: "http://localhost:3000",
});

export const api = new DefaultApi(configuration, undefined, axiosBackendClient);
