import qs from "qs";
import store from "@/store";
import { getWxUser } from "@/api/wx";
import { Router } from "framework7/types";

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
  // 在此处处理授权跳转
  item.beforeEnter = async function ({ resolve, to }) {
    if (process.env.NODE_ENV === "production") {
      const { code: wxcode } = to.query;
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
        const origin = window.location.origin;
        const url = encodeURIComponent(decodeURIComponent(to.url)) // 防止原url携带的参数值有中文，先解码，再转码，
        window.location.href = `${origin}/redirect.html?state=${url}`;
      }
    } else {
      resolve();
    }
  };
  
  item.on = {};
  // 动态设置页面title
  item.on.pageAfterIn = () => {
    document.title = item?.meta?.title as string;
  }
});
export default routes;
