import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home/index.vue";
import Main from "../views/Main.vue";
import Subscription from "@/views/subscription.vue";
import PersonalPage from "@/views/PersonalPage/index.vue";
import WatchHistory from "@/views/watchHistory.vue";
import VideoPage from "@/views/videoPage/index.vue";
import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
import ExamineVideo from "@/views/examineVideo.vue";
import UploadVideo from "@/views/UploadVideo/index.vue";

interface MetaType {
  title: string;
}

const routes: Array<RouteRecordRaw & { meta?: MetaType }> = [
  {
    path: "/",
    name: "Main",
    component: Main,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home,
        meta: { title: "littleSauce" },
      },
      {
        // 订阅
        path: "/subscription",
        name: "Subscription",
        component: Subscription,
        children: [],
      },
      {
        path: "/user/:videoName?",
        name: "User",
        component: PersonalPage,
        meta: { title: "个人中心" },
      },
      {
        path: "/uploadVideo",
        name: "UploadVideo",
        component: UploadVideo,
        meta: { title: "上传视频" },
      },
      {
        path: "/examineVideo/:id?",
        name: "ExamineVideo",
        component: ExamineVideo,
        meta: { title: "审核视频" },
      },
    ],
  },
  {
    path: "/videoPage",
    name: "VideoPage",
    component: VideoPage,
    meta: { title: "加载中···" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "请登录" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "请先注册" },
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
