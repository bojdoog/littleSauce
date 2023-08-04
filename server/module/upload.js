const express = require("express");
const router = express.Router();
const db = require("../helper/db");

const fs = require("fs");
const multer = require("multer");
// const ffmpeg = require('ffmpeg');
const ffmpeg = require("fluent-ffmpeg");

// 处理表单数据
const formidable = require("formidable");
const { log } = require("console");

function getfilesize(size) {
  //把字节转换成正常文件大小
  if (!size) return "";
  var num = 1024.0; //byte
  if (size < num) return size + "B";
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

// const unauditedVideoPath = '/var/www/html/unauditedVideo'
// const resourcePath = "/var/www/html";

const unauditedVideoPath =
  "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\UnauditedVideo\\";
const resourcePath = "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\";
const videoPath = "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\video";

var storage = multer.diskStorage({
  // 函数的形式
  destination: function (req, file, cb) {
    // 函数接收三个参数
    // req 请求报文
    // file 上传的文件属性对象
    // cb 回调函数
    // 回调函数参数信息
    // cb(错误信息,文件存储路径信息)
    cb(null, unauditedVideoPath);
  },
});

// // 生产环境代码
// router.post('/uploadVideo', multer({ storage }).single('file'), (req, res) => {
//     const file = req.file;
//     file.originalname = Buffer.from(file.originalname, "latin1").toString(
//         "utf8"
//     )
//
//     fs.renameSync(`${unauditedVideoPath}/${file.filename}`, `${unauditedVideoPath}/${file.originalname}`)
//     file.path = `${unauditedVideoPath}/${file.originalname}`
//     res.send(file)
// })

// 开发环境代码
router.post(
  "/uploadVideo",
  multer({ storage }).single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      fs.renameSync(
        `${unauditedVideoPath}/${file.filename}`,
        `${unauditedVideoPath}/${file.originalname}`
      );
      file.path = `${unauditedVideoPath}/${file.originalname}`;
      let form = new formidable.IncomingForm();
      // 解析客户端传递过来的FormData对象
      // fields: 普通表单相关数据;
      // files: 上传的文件相关信息;
      form.parse(req, (err, fields, files) => {
        if (err) console.log(err);
        console.log(fields, "fields");
      });
      // new ffmpeg(unauditedVideoPath + file.originalname, function (video) {
      //     console.log(video);
      //     console.log(video.metadata.video.resolution, '分辨率');
      //     console.log(video.metadata.duration.seconds, 'Video 的时长') // Video 的时长
      // })
      // console.log(unauditedVideoPath + file.originalname, 'unauditedVideoPath + file.originalname');
      // const process = new ffmpeg()
      // process.input(unauditedVideoPath + file.originalname)
      // console.log(process);
      // process.then(function (video) {
      //     console.log(video, 'video');
      //     console.log(video.metadata.video.resolution, '分辨率');
      //     console.log(video.metadata.duration.seconds, 'Video 的时长') // Video 的时长
      // }, function (err) {
      //     console.log('Error: ' + err);
      // });
      res.send({ code: 0, msg: "视频上传成功" });
    } catch (e) {
      res.send({ code: -1, msg: "视频上传失败", reason: e });
    }
  }
);

router.get("/getUnauditedVideo", async (req, res) => {
  // fs.readdir(`${unauditedVideoPath}`, async (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  //   let unauditedVideoInfo = {};
  //   let unauditedVideoInfoArr = [];
  //   data.forEach((e) => {
  //     // 获取文件大小
  //     let videoInfo;
  //     fs.stat(`${unauditedVideoPath}/${e}`, (err, data) => {
  //       if (err) throw err;
  //       videoInfo = data;
  //       let size = videoInfo.size;
  //       size = getfilesize(size);
  //       console.log(size, "size");
  //       unauditedVideoInfo.videoName = e;
  //       unauditedVideoInfo.size = size;
  //       unauditedVideoInfoArr.push(unauditedVideoInfo);
  //       console.log(unauditedVideoInfoArr);
  //     });
  //   });
  //   res.json({
  //     unauditedVideoInfoArr: data,
  //     unauditedVideo_src: `${unauditedVideoPath}`,
  //   });
  // });
  const $query = "select * from unaudited_video";
  try {
    const unauditedVideoInfo = await db($query);
    res.json({ msg: "success", unauditedVideoInfo });
  } catch (e) {
    console.log(e);
    res.json({ msg: "failed", reason: e });
  }
});

router.get("/auditedVideo", async (req, res) => {
  const { isPass, video_id, duration } = req.query;
  const $deleteInfo =
    "delete from unaudited_video where id = '" + video_id + "'";
  try {
    if (isPass === "true") {
      const $getVideoInfo =
        "select * from unaudited_video where id = '" + video_id + "'";
      const video_info = await db($getVideoInfo);
      let [{ uid, video_src, poster_src, title, date }] = video_info;
      let videoFileName = video_src.split("/")[2];
      let posterFileName = poster_src.split("/")[2];
      video_src = "/video/" + videoFileName;
      poster_src = "/poster/" + posterFileName;
      console.log(uid, video_src, poster_src, title, date, duration);
      const $insertVideo =
        "insert into video_info (uid,video_src,preview_src,title,date,duration) values ('" +
        uid +
        "','" +
        video_src +
        "','" +
        poster_src +
        "','" +
        title +
        "','" +
        date +
        "','" +
        duration +
        "')";
      await db($insertVideo);
      // 删除掉视频信息
      await db($deleteInfo);
      res.json({ code: 0, message: "审核通过", status: 200 });
      // 移动文件
      fs.rename(
        `${resourcePath}/UnauditedVideo/${videoFileName}`,
        `${resourcePath}/video/${videoFileName}`,
        (err) => {
          if (err) throw err;
          console.log("视频移动完成");
        }
      );
      fs.rename(
        `${resourcePath}/UnauditedPoster/${posterFileName}`,
        `${resourcePath}/poster/${posterFileName}`,
        (err) => {
          if (err) throw err;
          console.log("封面移动完成");
        }
      );
    } else if (isPass === "false") {
      const $getFilePath =
        "select video_src,poster_src from unaudited_video where id = '" +
        video_id +
        "'";
      // 获取到删除的资源路径
      const [tFilePath] = await db($getFilePath);
      const [{ video_src, poster_src }] = await db($getFilePath);

      // 删除掉视频信息
      await db($deleteInfo);
      res.json({ code: 0, message: "审核未能通过", status: 200 });
      // 删除掉驳回的视频文件
      fs.unlink(`${resourcePath.slice(0, -1)}${video_src}`, (err) => {
        if (err) throw err;
        console.log("视频文件删除成功");
      });
      fs.unlink(`${resourcePath.slice(0, -1)}${poster_src}`, (err) => {
        if (err) throw err;
        console.log("封面文件删除成功");
      });
    }
  } catch (e) {
    console.log(e);
    res.send({ code: -1, msg: "出错啦", reason: e });
  }
});

module.exports = router;
