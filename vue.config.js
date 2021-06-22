/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const DotEnv = require("dotenv-webpack");

module.exports = {
  publicPath: "./",
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    index: {
      title: "基于Vue3.0微信公众号网页开发",
      entry: path.resolve(__dirname, "./src/main.ts"),
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
    },
    auth: {
      entry: path.resolve(__dirname, "./src/wx-redirect/main.ts"),
      template: path.resolve(__dirname, "./src/wx-redirect/redirect.html"),
      filename: "redirect.html",
    },
  },
  configureWebpack: () => {
    const envPath =
      process.env.NODE_ENV === "development" || process.env.NODE_ENVS === "test"
        ? "./.env.dev"
        : "./.env.prod";
    return {
      plugins: [
        new DotEnv({
          path: path.resolve(__dirname, envPath),
        }),
        // new CompressionPlugin({
        //   test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        //   threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
        //   deleteOriginalAssets: false, // 是否删除原文件
        // }),
      ],
    };
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
