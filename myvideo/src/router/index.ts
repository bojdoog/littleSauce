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

const routes: Array<RouteRecordRaw> = [
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
      },
      {
        path: "/subscription",
        name: "Subscription",
        component: Subscription,
        children: [],
      },
      {
        path: "/user/:videoName?",
        name: "User",
        component: PersonalPage,
      },
      {
        path: "/uploadVideo",
        name: "UploadVideo",
        component: UploadVideo,
      },
      {
        path: "/examineVideo/:id?",
        name: "ExamineVideo",
        component: ExamineVideo,
      },
    ],
  },
  {
    path: "/videoPage",
    name: "VideoPage",
    component: VideoPage,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
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
