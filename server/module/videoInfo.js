const express = require("express");
const router = express.Router();
const db = require("../helper/db");

const fs = require("fs");
const multer = require("multer");

const unauditedPosterPath = "/var/www/html/UnauditedPoster";

// const unauditedPosterPath =
//   "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\UnauditedPoster";

var storage = multer.diskStorage({
  // 函数的形式
  destination: function (req, file, cb) {
    // 函数接收三个参数
    // req 请求报文
    // file 上传的文件属性对象
    // cb 回调函数
    // 回调函数参数信息
    // cb(错误信息,文件存储路径信息)
    cb(null, unauditedPosterPath);
  },
});

router.post(
  "/uploadVideoInfo",
  multer({ storage }).single("file"),
  async (req, res) => {
    let { videoInfo } = req.body;
    videoInfo = JSON.parse(videoInfo);
    console.log(videoInfo, "videoInfo");
    const file = req.file;
    console.log(file, "file");
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    fs.renameSync(
      `${unauditedPosterPath}/${file.filename}`,
      `${unauditedPosterPath}/${file.originalname}`
    );
    file.path = `${unauditedPosterPath}/${file.originalname}`;
    const $query =
      "insert into unaudited_video (uid,video_src,poster_src,title,date)values(" +
      videoInfo.uid +
      ",'" +
      "/UnauditedVideo/" +
      videoInfo.videoName +
      "','" +
      "/UnauditedPoster/" +
      file.originalname +
      "','" +
      videoInfo.title +
      "','" +
      videoInfo.uploadDate +
      "')";
    try {
      await db($query);
      res.send({ code: 0, msg: "视频信息上传成功" });
    } catch (e) {
      console.log(e);
      res.send({ code: -1, msg: "上传失败" });
    }
  }
);

module.exports = router;
