// 微信授权回调页
function getUrlParam(name = "") {
  // 构造一个含有目标参数的正则表达式对象
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // 匹配目标参数
  const r = window.location.search.substr(1).match(reg);
  // 返回参数
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}
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
