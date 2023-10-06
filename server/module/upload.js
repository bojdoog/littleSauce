const express = require("express");
const router = express.Router();
const db = require("../helper/db");

const fs = require("fs");
const multiparty = require("multiparty");
const { Buffer } = require("buffer");
const path = require("path");

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

const unauditedVideoPath = "/var/www/html/UnauditedVideo/";
const resourcePath = "/var/www/html/";

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
      console.log(chunk, "chunk");
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
      .sort((a, b) => a - b)
      .map((file, index) => {
        const buffer = fs.readFileSync(
          `${resourcePath}temp/${filename}/${file}`
        );
        len += buffer.length;
        console.log(file, "file");
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
