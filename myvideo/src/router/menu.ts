import Cookies from "js-cookie";

const adminMenu = [
  {
    path: "/home",
    name: "Home",
    label: "首页",
    icon: "House",
    url: "./views/Home/index.vue",
    meta: { title: "littleSauce" },
  },
  {
    path: "/user",
    name: "User",
    label: "个人主页",
    icon: "User",
    url: "./views/PersonalPage/index.vue",
    meta: { title: "个人中心" },
  },
  {
    path: "/uploadVideo",
    name: "UploadVideo",
    label: "上传视频",
    icon: "Upload",
    url: "./views/UploadVideo/index.vue",
    meta: { title: "上传视频" },
  },
  {
    path: "/examineVideo",
    name: "ExamineVideo",
    label: "视频审核",
    icon: "Edit",
    url: "./views/examineVideo.vue",
    meta: { title: "审核视频" },
  },
  {
    path: "/subscription",
    name: "Subscription",
    label: "你的订阅",
    icon: "UserFilled",
    children: [],
    url: "./views/subscription.vue",
  },
];

const userMenu = [
  {
    path: "/home",
    name: "Home",
    label: "首页",
    icon: "House",
    url: "./views/Home/index.vue",
    meta: { title: "littleSauce" },
  },
  {
    path: "/user",
    name: "User",
    label: "个人主页",
    icon: "User",
    url: "./views/PersonalPage/index.vue",
    meta: { title: "个人中心" },
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
    url: "./views/UploadVideo/index.vue",
    meta: { title: "上传视频" },
  },
  {
    path: "/subscription",
    name: "Subscription",
    label: "你的订阅",
    icon: "UserFilled",
    children: [],
    url: "./views/subscription.vue",
  },
];

const isAdmin = JSON.parse(Cookies.get("USER_INFO")).isAdmin;
const menu = isAdmin ? adminMenu : userMenu;
export default menu;
