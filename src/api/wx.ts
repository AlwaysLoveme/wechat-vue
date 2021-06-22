/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "@/shared/axios";

export function GetSignature({ url = "" }) {
  return axios({
    url: "/api",
    method: "GET",
    params: {
      url,
    },
  });
}
export function getWxUser({ code = "" }) {
  return axios({
    url: "/api",
    method: "GET",
    params: {
      code,
    },
  });
}
