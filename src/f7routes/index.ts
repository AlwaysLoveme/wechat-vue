import qs from "qs";
import store from "@/store";
import { getWxUser } from "@/api/wx";
import { Routes } from "@/typings/router";
import { stringifyUrl } from "@/shared/wx-config";

const routes: Routes[] = [
  {
    path: "/",
    meta: {
      title: "",
    },
    asyncComponent: () => import("@/pages/Home.vue"),
  },
];

routes.map((item) => {
  item.on = {};
  item.beforeEnter = async function ({ resolve, to }) {
    if (process.env.NODE_ENV !== "development") {
      const { query, path } = to;
      const queryParams = qs.stringify(query);
      const wxcode = stringifyUrl("code");
      if (wxcode) {
        window.sessionStorage.setItem("wxcode", wxcode as string);
      }
      if (window.sessionStorage.wxcode) {
        if (!store.state.user) {
          const { data } = await getWxUser({
            code: window.sessionStorage.wxcode,
          });
          if (data) store.commit("setUserInfo", data);
        }
        resolve();
      } else {
        const state = encodeURIComponent(path + "?" + queryParams);
        const origin = window.location.origin;
        window.location.href = `${origin}/auth.html?state=${state}`;
      }
    } else {
      resolve();
    }
  };
  item.on.pageAfterIn = function () {
    document.title = item?.meta?.title as string;
  };
});
export default routes;
