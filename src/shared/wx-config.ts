/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import qs from "qs";
import wx from "weixin-js-sdk";
import { GetSignature } from "@/api/wx";

export { wx };
export async function WXConfig() {
  try {
    const { data } = await GetSignature();
    return new Promise((resolve, reject) => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: "wxf0074a25ead29c1d", // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "chooseImage",
          "getLocalImgData",
        ], // 必填，需要使用的JS接口列表
      });
      wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        resolve(true);
      });
      wx.error(function (error: string) {
        console.log(error);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        reject(error);
      });
    });
  } catch (error) {
    setTimeout(() => WXConfig(), 2000);
  }
}

export function SetShareInfo({ title = "", desc = "", link = "" }) {
  wx.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: "https://img.viivago.com.cn/viivafang.png", // 分享图标
  });
  wx.updateTimelineShareData({
    title, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: "https://img.viivago.com.cn/viivafang.png", // 分享图标
  });
}
export function getUrlParam(name = "") {
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
export function stringifyUrl(str = "") {
  const url = window.location.href;
  return qs.parse(url.split?.("?")[1])?.[str];
}
