const { defineConfig } = require("@vue/cli-service");
const { DefinePlugin } = require("webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  devServer: {
    // index: '/login.html',   //默认打开文件
    // open: true,             //自动打开浏览器
    host: "localhost", //默认打开域名
    port: 7000, //默认打开端口号
    https: false, //开启关闭https请求
    // hotOnly: false,         //热更

    // proxy: {
    // //   // 配置跨域
    //   '/api': {
    //     target: 'http://127.0.0.1:6000', //代理地址，这里设置的地址会代替axios中设置的baseURL
    // //     ws: true,// proxy websockets,
    // //     changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
    // //     pathRewrite: {                //pathRewrite方法重写url
    // //       '^/api': '/',
    // //     },
    //   },
    // },
  },
  configureWebpack: {
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
});
