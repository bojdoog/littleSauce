const express = require("express");
const router = express.Router();
const db = require("../helper/db");

const fs = require("fs");
const multiparty = require("multiparty");
const { Buffer } = require("buffer");
const path = require("path");

const multer = require("multer");
// const ffmpeg = require('ffmpeg');
const ffmpeg = require("fluent-ffmpeg");

// 处理表单数据
const formidable = require("formidable");

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

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

const unauditedVideoPath = "/var/www/html/UnauditedVideo/";
const resourcePath = "/var/www/html/";

// const unauditedVideoPath =
//   "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\public\\UnauditedVideo\\";
// const resourcePath = "D:\\code-qianduan\\VIDEO_PROJECT\\myvideo\\";

// var storage = multer.diskStorage({
//   // 函数的形式
//   destination: function (req, file, cb) {
//     // 函数接收三个参数
//     // req 请求报文
//     // file 上传的文件属性对象
//     // cb 回调函数
//     // 回调函数参数信息
//     // cb(错误信息,文件存储路径信息)
//     cb(null, unauditedVideoPath);
//   },
// });

// router.post(
//   "/uploadVideo",
//   multer({ storage }).single("file"),
//   async (req, res) => {
//     try {
//       const file = req.file;
//       file.originalname = Buffer.from(file.originalname, "latin1").toString(
//         "utf8"
//       );
//       fs.renameSync(
//         `${unauditedVideoPath}/${file.filename}`,
//         `${unauditedVideoPath}/${file.originalname}`
//       );
//       file.path = `${unauditedVideoPath}/${file.originalname}`;
//       let form = new formidable.IncomingForm();
//       // 解析客户端传递过来的FormData对象
//       // fields: 普通表单相关数据;
//       // files: 上传的文件相关信息;
//       form.parse(req, (err, fields, files) => {
//         if (err) console.log(err);
//         console.log(fields, "fields");
//       });
//       res.send({ code: 0, msg: "视频上传成功" });
//     } catch (e) {
//       res.send({ code: -1, msg: "视频上传失败", reason: e });
//     }
//   }
// );

router.post("/uploadVideo", (req, res) => {
  const form = new multiparty.Form();
  // fields: 普通表单相关数据;
  // files: 上传的文件相关信息;
  form.parse(req, function (err, fields, files) {
    let filename = fields.filename[0];
    let hash = fields.hash[0];
    let chunk = files.chunk[0];
    let dir = `${resourcePath}temp/${filename}`;
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      // 从切片文件路径读取二进制数据
      const buffer = fs.readFileSync(chunk.path);
      console.log(chunk.path, "chunk.path");
      const ws = fs.createWriteStream(`${dir}/${hash}`);
      ws.write(buffer);
      ws.close();
      res.send({ code: 0, message: "分片上传成功" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ code: -1, message: "上传失败" });
    }
  });
});

// 合并
router.get("/merge", async (req, res) => {
  const { filename } = req.query;
  await delay(1000);
  try {
    let len = 0;
    // 二进制文件组成的数组
    const bufferList = fs
      .readdirSync(`${resourcePath}temp/${filename}`)
      .map((file, index) => {
        const buffer = fs.readFileSync(
          `${resourcePath}temp/${filename}/${file}`
        );
        len += buffer.length;
        return buffer;
      });
    // 合并分片
    const buffer = Buffer.concat(bufferList, len);
    const ws = fs.createWriteStream(
      `${resourcePath}UnauditedVideo/${filename}.mp4`
    );
    ws.write(buffer);
    ws.close();
    fs.readdirSync(`${resourcePath}temp/${filename}`).forEach((file) => {
      const curPath = path.join(`${resourcePath}temp/${filename}/`, file);
      fs.unlinkSync(curPath); // 删除文件
    });
    fs.rmdirSync(`${resourcePath}temp/${filename}`); // 删除空文件夹
    res.send({ message: "合并成功" });
  } catch (error) {
    console.error(error);
    res.send({ message: "合并失败" });
  }
});

// 检测断点
router.get("/checkPoint", (req, res) => {
  const { filename } = req.query;
  const dir = `${resourcePath}temp/${filename}`;
  try {
    if (!fs.existsSync(dir)) {
      res.send({
        message: "没找到之前的上传记录",
        success: true,
        point: 0,
        hash: 0,
      });
    } else {
      let len = 0;
      let hash = 0;
      fs.readdirSync(`${resourcePath}temp/${filename}`).forEach(
        (item, index) => {
          const buffer = fs.readFileSync(
            `${resourcePath}temp/${filename}/${item}`
          );
          len += buffer.length;
          hash += 1;
        }
      );
      return res.send({
        message: "有上传记录,开始断点续传",
        success: true,
        point: len,
        hash,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: error });
  }
});

module.exports = router;
