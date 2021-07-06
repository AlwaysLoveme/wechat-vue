/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "@/shared/axios";

// get wechat sdk config
export function GetSignature() {
  return axios({
    url: "/api",
    method: "GET",
    params: {
      url: window.location.href.split("#")[0],
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
