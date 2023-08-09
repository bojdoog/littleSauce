const express = require("express");
const router = express.Router();
const db = require("../helper/db");
const { promises } = require("fs");

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

router.get("/info", async (req, res) => {
  const { video_id } = req.query;
  console.log("连接成功  video_id=>", video_id);
  const $query =
    'select id,video_info.uid,video_src,preview_src,title,date,views,duration,username from video_info,users where video_info.id="' +
    video_id +
    '" and video_info.uid = users.uid';
  const $query2 =
    'update video_info set views = views +1 where id = "' + video_id + '"';
  try {
    const [videoInfo] = await db($query);
    await db($query2);
    res.json({ code: 0, videoInfo, message: "获取单个视频信息成功" });
  } catch (e) {
    // e是数据库报错信息
    console.error(e);
    res.json({ code: -1, data: [], message: e });
  }
});

router.get("/allInfo", async (req, res) => {
  const $query =
    "select id,video_info.uid,video_src,preview_src,title,date,views,barrages,duration,username from video_info,users where video_info.uid = users.uid";
  try {
    const videoInfo = await db($query);
    const barragesNumPromises = videoInfo.map(async (e) => {
      const $query2 =
        'select video_id,count(*)barragesNum FROM videoweb.barrages where video_id = "' +
        e.id +
        '"';
      const barragesNum = await db($query2);
      return barragesNum[0];
    });
    const barragesNumArr = await Promise.all(barragesNumPromises);
    console.log(barragesNumArr);
    res.json({
      code: 0,
      data: videoInfo,
      message: "获取多个视频信息成功",
      status: 200,
      barragesNumArr,
    });
  } catch (e) {
    console.log(e);
    res.json({ code: -1, data: [], message: e });
  }
});

router.get("/dmInfo", async (req, res) => {
  const { video_id } = req.query;
  const $query =
    'select id,barrage,duration,date from barrages where video_id="' +
    video_id +
    '"';
  const $query2 =
    'select count(*)barragesNum FROM videoweb.barrages where video_id="' +
    video_id +
    '"';
  try {
    const dmInfo = await db($query);
    const barragesNum = await db($query2);
    res.json({
      code: 0,
      data: dmInfo,
      message: "获取弹幕信息成功",
      barragesNum: barragesNum[0],
    });
  } catch (e) {
    res.json({ code: -1, data: [], message: e });
  }
});

router.post("/receiveDm", async (req, res) => {
  const dmInfo = req.body;
  const { video_id, barrage, duration, date } = dmInfo;
  console.log(dmInfo);
  const $query =
    'insert into barrages (video_id,barrage,duration,date)values("' +
    video_id +
    '","' +
    barrage +
    '","' +
    duration +
    '","' +
    date +
    '")';
  try {
    // 把弹幕加入数据库
    await db($query);
    res.json({ code: 0, data: {}, message: "弹幕存储成功" });
  } catch (e) {
    res.json({ code: -1, data: [], message: e });
  }
});

module.exports = router;
