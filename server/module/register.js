const express = require("express");
const router = express.Router();
const db = require("../helper/db");
const logger = require("../logger");
router.post("/verifyUsername", async (req, res) => {
  const $query =
    "select count(*) as num from users where binary username = '" +
    req.body.unVerifyUsername +
    "'";
  try {
    const [{ num }] = await db($query);
    if (num === 0) {
      res.json({ code: 0, status: 1, msg: "success" });
    } else {
      res.json({ code: 0, status: -1, msg: "用户名已存在" });
    }
  } catch (e) {
    logger.error("验证用户名时出错", e);
    res.json({ code: -1, data: [], message: e });
  }
});

router.post("/verifyAccount", async (req, res) => {
  const $query =
    "select count(*) as num from users where binary account = '" +
    req.body.unVerifyAccount +
    "'";
  try {
    const [{ num }] = await db($query);
    if (num === 0) {
      res.json({ code: 0, status: 1, msg: "success" });
    } else {
      res.json({ code: 0, status: -1, msg: "账号已存在" });
    }
  } catch (e) {
    logger.error("验证用户名时出错", e);
    res.json({ code: -1, data: [], message: e });
  }
});

router.post("/register", async (req, res) => {
  const { username, password, account } = req.body;
  const $query =
    "insert into users (username,password,account ) values ('" +
    username +
    "','" +
    password +
    "','" +
    account +
    "')";
  try {
    console.log(username, password, account);
    await db($query);
    res.json({ code: 0, msg: "success" });
  } catch (e) {
    console.log("error", e);
    res.json({ code: -1, msg: "error" });
  }
});

module.exports = router;
