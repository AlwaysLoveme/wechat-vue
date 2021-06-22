/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "weixin-js-sdk" {
  interface WX {
    config: (args) => void;
    ready: (callback: () => void) => void;
    error: (callback: (err: string) => void) => void;
    updateAppMessageShareData: (args) => void;
    updateTimelineShareData: (args) => void;
    chooseImage: (args) => void;
    getLocalImgData: (args) => void;
  }
  const wx: WX;
  export default wx;
};