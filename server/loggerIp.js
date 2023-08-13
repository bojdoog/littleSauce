const fs = require("fs");
let options = {
  flags: "a", //
  encoding: "utf8", // utf8编码
};
let stderr = fs.createWriteStream("./IPAddress.log", options);
// 创建logger
let loggerIp = new console.Console(stderr);
fs.writeFile("./error.log", "", function (err) {
  if (err) {
    console.log(err);
  }
});

module.exports = loggerIp;
