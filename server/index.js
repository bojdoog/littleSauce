const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { expressjwt: expressJWT } = require("express-jwt");
const jwt = require("jsonwebtoken");
// 允许跨域资源共享
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Expose-Headers, Platform, Token, Uid"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, HEAD"
  );
  next();
});

// 定义 secret 密钥，建议将密钥命名为 secretKey
const secretKey = "zhl No.1 ~0.0~";

//注册将 JWT 字符串解析还原成 JSON 对象的中间件
app.use(
  expressJWT({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/userInfo\/api\//, /^\/register\//],
  })
); // unless后面匹配的是不需要访问权限的接口

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "512mb",
    parameterLimit: 50000,
  })
);

// app.use((req, res, next) => {
//     console.log('every');
//     if (req.headers.authorization != undefined) {
//         const token = req.headers.authorization.slice(7)
//         console.log(token);
//         var info = jwt.verify(token, secretKey, (error, decoded) => {
//             if (error) {
//                 // console.log("token过期或者无效")
//                 return { tokenOut: true }
//             }
//         });
//         console.log(info, '11');
//     }
//     next()
// })
app.use("/video", require(__dirname + "/module/video"));
app.use("/userInfo", require(__dirname + "/module/userInfo"));
app.use("/upload", require(__dirname + "/module/upload"));
app.use("/videoInfo", require(__dirname + "/module/videoInfo"));
app.use("/register", require(__dirname + "/module/register"));
app.use("/audite", require(__dirname + "/module/auditedVideo"));

app.use((err, req, res, next) => {
  // 错误是由token解析失败导致的
  if (err.name === "UnauthorizedError") {
    res.statusCode = 401;
    return res.send({
      status: 401,
      message: "无效的token,请重新登陆",
    });
  }
  console.log(err);
  res.statusCode = 500;
  res.send({
    status: 500,
    message: "未知的错误",
  });
});

app.listen(443, () => {
  console.log("服务器运行在http://111.231.7.251:443");
});
