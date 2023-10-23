// import axiosBackendClient, { axiosBaseUrl } from "../axios/axios-client";
import { DefaultApi } from "../../../../packages/node-client/openapi/api";
import { Configuration } from "../../../../packages/node-client/openapi/configuration";
import axiosBackendClient from "../axios/axios-client";

const configuration = new Configuration({
  //   basePath: window.location.origin,
  basePath: "http://localhost:3000",
});

export const api = new DefaultApi(configuration, undefined, axiosBackendClient);
// export const tasksApi = new DefaultApi(
//   {
//     basePath: axiosBaseUrl,
//     isJsonMime: () => false,
//   },
//   undefined,
//   axiosBackendClient
// );
