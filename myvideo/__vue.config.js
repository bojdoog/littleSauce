/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DefinePlugin } = require("webpack");
const { name } = require("./package.json");

module.exports = {
  publicPath: "./",
  css: {
    extract: false,
  },
  devServer: {
    host: "localhost", //默认打开域名
    port: 7000, //默认打开端口号
    https: false, //开启关闭https请求
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    disableHostCheck: true,
  },
  chainWebpack: (config) => {
    config.output
      .filename("js/[name].[hash].js")
      .chunkFilename("js/[name].[hash].js")
      .end();
  },
  configureWebpack: {
    // resolve: { alias: { qiankun: "@evideo/qiankun" } },
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      // jsonpFunction: `webpackJsonp_${name}`,
    },
    plugins: [
      new DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        VERSION: JSON.stringify("5fa3b9"),
        BROWSER_SUPPORTS_HTML5: true,
        TWO: "1+1",
        "typeof window": JSON.stringify("object"),
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          RELEASE_ENV: JSON.stringify(process.env.RELEASE_ENV),
        },
      }),
    ],
  },
};
