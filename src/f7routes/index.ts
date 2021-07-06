import qs from "qs";
import store from "@/store";
import { getWxUser } from "@/api/wx";
import { Router } from "framework7/types";
import { stringifyUrl } from "@/shared/wx-config";

interface RoutesExtend {
  meta?: Record<string, unknown>;
}
export type Routes = Router.RouteParameters & RoutesExtend;

const routes: Routes[] = [
  {
    path: "/",
    meta: {
      title: "首页",
    },
    asyncComponent: () => import("@/pages/Home.vue"),
  },
];

routes.map((item) => {
  item.on = {};
  item.beforeEnter = async function ({ resolve, to }) {
    document.title = item?.meta?.title as string;
    if (process.env.NODE_ENV !== "development") {
      const wxcode = stringifyUrl("code");
      if (wxcode) {
        window.sessionStorage.setItem("wxcode", wxcode as string);
      }
      if (window.sessionStorage.wxcode) {
        if (!store.state.user) {
          // 依据微信返回的code,获取用户openid等基本信息
          const { data } = await getWxUser({
            code: window.sessionStorage.wxcode,
          });
          if (data) store.commit("setUserInfo", data);
        }
        resolve();
      } else {
        //const state = encodeURIComponent(path + "?" + queryParams);
        const origin = window.location.origin;
        const url = encodeURIComponent(decodeURIComponent(to.url)) // 防止原url携带的参数值有中文，先解码，再转码，
        window.location.href = `${origin}/redirect.html?state=${url}`;
      }
    } else {
      resolve();
    }
  };
});
export default routes;
