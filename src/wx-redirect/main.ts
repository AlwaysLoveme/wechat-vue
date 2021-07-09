import { getUrlParam } from "@/shared/wx-config";

const code = getUrlParam("code");
const state = getUrlParam("state");
const base_url = window.location.origin;
if (code) {
  // window.location.href = `${URL}front/test/#/?code=${code}&url=${encodeURIComponent(state)}`;
  if (state === "/?")
    window.location.replace(`${base_url}/#/?code=${code}&url=${state}`);
  else {
    // 微信授权尽量在首页就进行授权
    const url = decodeURIComponent(state as string);
    const redirectUrl = `${base_url}/#${url}${
      url.indexOf("?") !== -1 ? "&" : "?"
    }code=${code}`;
    window.location.replace(redirectUrl);
  }
} else {
  const url = encodeURIComponent(`${base_url}/redirect.html`);
  window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0074a25ead29c1d&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`);
}
