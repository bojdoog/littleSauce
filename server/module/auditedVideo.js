const express = require("express");
const router = express.Router();
const db = require("../helper/db");
const fs = require("fs");

const resourcePath = "/var/www/html/";

router.get("/getUnauditedVideo", async (req, res) => {
  const $query = "select * from unaudited_video";
  try {
    const unauditedVideoInfo = await db($query);
    res.json({ msg: "success", unauditedVideoInfo });
  } catch (e) {
    console.log(e);
    res.json({ msg: "failed", reason: e });
  }
});

router.get("/auditeVideo", async (req, res) => {
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
