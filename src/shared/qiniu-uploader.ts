/* eslint-disable @typescript-eslint/no-this-alias */
import * as qiniu from "qiniu-js";
import { getQiniuToken } from "@/api/qiniu";
import { WXConfig, wx } from "./wx-config";
import { showLoading, hideLoading, toast } from "@/shared/f7base";

class Qiniu {
  token!: string;
  domain!: string;
  config = {
    useCdnDomain: true,
    disableStatisticsReport: true,
  };

  constructor() {
    WXConfig();
    if (!this.token) {
      getQiniuToken().then(({ data }) => {
        this.token = data;
      });
    }
  }

  // 微信选取图片
  chooseImage(imagesCount = 9): Promise<File[]> {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: imagesCount, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        async success(res: any) {
          let count = 0;
          const files: File[] = [];
          function getLocalImgData() {
            wx.getLocalImgData({
              localId: res.localIds[count], // 图片的localID
              async success(result: { localData: string }) {
                let localData = result.localData; // localData是图片的base64数据，可以用img标签显示
                if (localData.indexOf("data:image") === -1) {
                  //判断是否有这样的头部
                  localData = "data:image/jpeg;base64," + localData;
                }
                localData = localData
                  .replace(/\r|\n/g, "")
                  .replace("data:image/jpg", "data:image/jpeg"); // 此处的localData 就是你所需要的base64位
                files.push(that.dataURLtoBlob(localData));
                count++;
                if (count < res.localIds.length) {
                  getLocalImgData();
                } else {
                  resolve(files);
                }
              },
            });
          }
          getLocalImgData();
        },
        fail(err: Error) {
          reject(err);
        },
      });
    });
  }
  dataURLtoBlob(dataurl: string) {
    const arr: string[] = dataurl.split(",");
    const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return this.blobToFile(new Blob([u8arr], { type: mime }), mime as string);
  }
  blobToFile(blob: Blob, mime: string) {
    return new window.File([blob], new Date().valueOf() + ".jpeg", {
      type: mime,
    });
  }
  upload(file: File, key = "") {
    return new Promise((resolve, reject) => {
      const observable = qiniu.upload(file, key, this.token, {}, this.config);
      const observer = {
        complete: (data: { key: string }) => {
          resolve(this.domain + data.key);
        },
        error(error: Error) {
          console.log(error, "上传出错");
          reject(error);
          subscription.unsubscribe();
        },
      };
      const subscription = observable.subscribe(observer); // 上传开始
    });
  }
  async uploadImages(imagesCount = 9) {
    const files = await this.chooseImage(imagesCount);
    let uploadCount = 0;
    const dataUrls: (string | unknown)[] = [];
    showLoading();
    return new Promise((resolve, reject) => {
      const upload = async () => {
        try {
          const res = await this.upload(
            files[uploadCount],
            files[uploadCount].name
          );
          dataUrls.push(res);
          uploadCount++;
          if (uploadCount < files.length) {
            upload();
          } else {
            hideLoading();
            resolve(dataUrls);
          }
        } catch (error) {
          hideLoading();
          console.log(error, "上传图片出错");
          toast(error);
          reject(error);
        }
      };
      upload();
    });
  }
}

export default new Qiniu();
