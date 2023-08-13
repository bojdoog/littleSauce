const fs = require("fs");
let options = {
  flags: "a", //
  encoding: "utf8", // utf8编码
};
let stderr = fs.createWriteStream("./error.log", options);
// 创建logger
let logger = new console.Console(stderr);
fs.writeFile("./error.log", "", function (err) {
  if (err) {
    console.log(err);
  }
});
// 真实项目中调用下面即可记录错误日志
// logger.log('这是一条日志1');
// logger.log('这是一条日志2');
// logger.log('这是一条日志3');
// 也可以设置定时清空内容
setTimeout(() => {
  fs.writeFile("./error.log", "", function (err) {
    if (err) {
      console.log(err);
    }
  });
}, 1000 * 3600 * 24); // 每24小时清空

module.exports = logger;
