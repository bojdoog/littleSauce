const express = require("express");
const router = express.Router();
const db = require("../helper/db");

// TODO_01：安装并导入 JWT 相关的两个包，分别是 jsonwebtoken 和 express-jwt
const jwt = require("jsonwebtoken");
const { expressjwt: expressJWT } = require("express-jwt");

// TODO_02：定义 secret 密钥，建议将密钥命名为 secretKey
const secretKey = "zhl No.1 ~0.0~";

const multer = require("multer");
const fs = require("fs");
const unauditedHeadsculpturePath = "/var/www/html/headsculpture";

// const unauditedHeadsculpturePath = "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\headsculpture";

var storage = multer.diskStorage({
  // 函数的形式
  destination: function (req, file, cb) {
    // 函数接收三个参数
    // req 请求报文
    // file 上传的文件属性对象
    // cb 回调函数
    // 回调函数参数信息
    // cb(错误信息,文件存储路径信息)
    cb(null, unauditedHeadsculpturePath);
  },
});

const adminMenu = [
  {
    path: "/home",
    name: "Home",
    label: "首页",
    icon: "House",
  },
  {
    path: "/user",
    name: "User",
    label: "个人主页",
    icon: "User",
  },
  // {
  //   path: "/watchHistory",
  //   name: "WatchHistory",
  //   label: "观看历史",
  //   icon: "VideoPlay",
  // },
  {
    path: "/uploadVideo",
    name: "UploadVideo",
    label: "上传视频",
    icon: "Upload",
  },
  {
    path: "/subscription",
    name: "Subscription",
    label: "你的订阅",
    icon: "UserFilled",
    children: [],
  },
  {
    path: "/examineVideo",
    name: "ExamineVideo",
    label: "视频审核",
    icon: "Edit",
  },
];

const userMenu = [
  {
    path: "/home",
    name: "Home",
    label: "首页",
    icon: "House",
  },
  {
    path: "/user",
    name: "User",
    label: "个人主页",
    icon: "User",
  },
  // {
  //   path: "/watchHistory",
  //   name: "WatchHistory",
  //   label: "观看历史",
  //   icon: "VideoPlay",
  // },
  {
    path: "/uploadVideo",
    name: "UploadVideo",
    label: "上传视频",
    icon: "Upload",
  },
  {
    path: "/subscription",
    name: "Subscription",
    label: "你的订阅",
    icon: "UserFilled",
    children: [],
  },
];
// app.use('/api', expressJWT({ secret: secretKey, algorithms: ["HS256"] })),
// 登录接口
router.post("/api/login", async (req, res) => {
  const user = req.body;
  const $query =
    "select username,uid,headsculpture as headsculpture_src,isAdmin,profile from users where binary account ='" +
    user.account +
    "'and password ='" +
    user.password +
    "'";
  try {
    const [userInfo] = await db($query);
    if (!userInfo) {
      res.statusCode = 401;
      return res.json({
        code: -1,
        userInfo: null,
        message: "账号密码存在错误",
        status: 401,
      });
    }
    // 登录成功
    // 在登录成功之后，调用 jwt.sign() 方法生成 JWT 字符串。并通过 token 属性发送给客户端
    const tokenStr = jwt.sign({ username: userInfo.account }, secretKey, {
      // 有效期内时长，秒*分*时*天
      expiresIn: 60 * 60 * 24 * 1,
    });
    if (userInfo.isAdmin === 1) {
      res.json({
        code: 0,
        userInfo,
        message: "登录成功",
        status: 200,
        token: tokenStr,
        menu: adminMenu,
      });
      console.log("管理员登录");
    } else {
      res.json({
        code: 0,
        userInfo,
        message: "登录成功",
        status: 200,
        token: tokenStr,
        menu: userMenu,
      });
      console.log("普通用户登录");
    }
  } catch (e) {
    console.log(e);
    res.json({ code: -1, data: [], message: "服务器报错", reason: e });
  }
});

router.post("/api/getUserInfo", async (req, res) => {
  const { uid } = req.body;
  console.log(uid, "uid");
  const $query =
    "select username,uid,headsculpture as headsculpture_src,isAdmin,profile from users where binary uid ='" +
    uid +
    "'";

  try {
    const [userInfo] = await db($query);
    if (!userInfo) {
      res.statusCode = 401;
      return res.json({
        code: -1,
        userInfo: null,
        message: "uid出错",
        status: 401,
      });
    }
    res.json({
      code: 0,
      userInfo,
      message: "获取用户信息成功",
      status: 200,
    });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.json({ code: -1, data: [], message: "获取用户信息失败", reason: e });
  }
});

router.post(
  "/updateUserInfo",
  multer({ storage }).single("file"),
  async (req, res) => {
    const { uid, username, profile, filename } = req.body;
    console.log(uid, username, profile, filename);
    try {
      if (filename) {
        const file = req.file;
        console.log(file, "file");
        file.originalname = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );
        fs.renameSync(
          `${unauditedHeadsculpturePath}/${file.filename}`,
          `${unauditedHeadsculpturePath}/${file.originalname}`
        );
        file.path = `${unauditedHeadsculpturePath}/${file.originalname}`;
        const $changeHeadsculpture = `update users set headsculpture='/headsculpture/${file.originalname}' where uid = '${uid}'`;

        await db($changeHeadsculpture);
      }
      const $updateInfo = `update users set username='${username}',profile = '${profile}' where uid = '${uid}'`;
      await db($updateInfo);
      res.json({ code: 0, message: "success" });
    } catch (e) {
      console.log(e);
      res.json({ code: -1, message: "fail", reason: e });
    }
  }
);

module.exports = router;
