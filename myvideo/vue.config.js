const { defineConfig } = require("@vue/cli-service");
const { DefinePlugin } = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  devServer: {
    // index: '/login.html',   //默认打开文件
    // open: true,             //自动打开浏览器
    host: "localhost", //默认打开域名
    port: 7000, //默认打开端口号
    https: false, //开启关闭https请求
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    entry: { entry: "./src/main.ts" },
    output: {
      library: `littleSauce-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
    },
    // output: {
    //   // // __dirname 代表当前文件的文件夹目录
    //   // path: path.resolve(__dirname, "./dist"),
    //   filename: "js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
    //   chunkFilename: "js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
    // },
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
    // optimization: {
    //   splitChunks: {
    //     chunks: "all",
    //     minChunks: 2,
    //     minSize: 20000,
    //     // maxSize: 50000,
    //     maxAsyncRequests: 5,
    //     maxInitialRequests: 3,
    //     automaticNameDelimiter: "-",
    //     name: "",
    //     cacheGroups: {
    //       // vendors: {
    //       //   test: /[\\/]node_modules[\\/]/,
    //       //   // 命名的回调
    //       //   name(module) {
    //       //     // get the name. E.g. node_modules/packageName/not/this/part.js
    //       //     // or node_modules/packageName
    //       //     const packageName = module.context.match(
    //       //       /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //       //     )[1];
    //       //     // npm package names are URL-safe, but some servers don't like @ symbols
    //       //     return `npm.${packageName.replace("@", "")}`;
    //       //   },
    //       // },
    //       // views: {
    //       //   name: "views",
    //       //   test: /[\\/]src[\\/]views[\\/]/, // 匹配 'src/components' 目录下的所有文件
    //       //   minChunks: 2, // 如果一个模块至少用到1次，就分割它
    //       //   priority: 100, // 优先级
    //       //   chunks: "async", // 只包括初始依赖的第三方库和组件，而不包括异步加载的
    //       //   reuseExistingChunk: true, // 如果当前的 chunk 已经从主 bundle 中拆分出来，那么将会直接复用，而不是重新生成一个新的
    //       // },
    //     },
    //   },
    // },
  },
  chainWebpack: (config) => {
    config.output
      .filename("js/[name].[hash].js")
      .chunkFilename("js/[name].[hash].js")
      .end();
    config.externals({
      vue: "Vue",
      // "vue-router": "VueRouter",
      "element-plus": "ElementPlus",
      // lodash: "lodash",
      // 更多的第三方库
    });
    //默认开启prefetch(预先加载模块)，提前获取用户未来可能会访问的内容 在首屏会把这十几个路由文件，都一口气下载了
    config.plugins.delete("prefetch");
    config.plugin("compressionPlugin").use(
      new CompressionPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)$/i, // 匹配文件名
        minRatio: 0.8, //只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
        // filename: "[path][base].br",
        // algorithm: "brotliCompress", // 压缩算法
        // test: /\.(js|css|less|svg|html)$/, // 匹配文件名
        // compressionOptions: {
        //   params: {
        //     [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // 使用了 Brotli 压缩算法的 params，并设置了压缩质量为 11。
        //   },
        // },
        threshold: 2048, // 对超过2k的数据压缩
        deleteOriginalAssets: false, // 是否删除除源文件
      })
    );
  },
});
