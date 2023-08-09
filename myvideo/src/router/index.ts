import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

interface MetaType {
  title: string;
}

const lazyLoad = (path: string, compName: string) => {
  return () => import(/* webpackChunkName:compName */ "@/views/" + path);
};
// "/* webpackChunkName:'mycomp' */ "的作用是将文件打包在同一个异步块‘mycomp’中
const routes: Array<RouteRecordRaw & { meta?: MetaType }> = [
  {
    path: "/",
    name: "Main",
    component: lazyLoad("Main.vue", "Main"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () =>
          import(/* webpackChunkName:'Home' */ "@/views/Home/index.vue"),
        meta: { title: "littleSauce" },
      },
      {
        // 订阅
        path: "/subscription",
        name: "Subscription",
        component: () =>
          import(
            /* webpackChunkName:'Subscription' */ "@/views/subscription.vue"
          ),
        children: [],
      },
      {
        path: "/user/:videoName?",
        name: "User",
        component: () =>
          import(
            /* webpackChunkName:'User' */ "@/views/PersonalPage/index.vue"
          ),
        meta: { title: "个人中心" },
      },
      {
        path: "/uploadVideo",
        name: "UploadVideo",
        component: () =>
          import(
            /* webpackChunkName:'UploadVideo' */ "@/views/UploadVideo/index.vue"
          ),
        meta: { title: "上传视频" },
      },
      {
        path: "/examineVideo/:id?",
        name: "ExamineVideo",
        component: () =>
          import(
            /* webpackChunkName:'ExamineVideo' */ "@/views/examineVideo.vue"
          ),
        meta: { title: "审核视频" },
      },
    ],
  },
  {
    path: "/videoPage",
    name: "VideoPage",
    component: () =>
      import(/* webpackChunkName:'VideoPage' */ "@/views/videoPage/index.vue"),
    meta: { title: "加载中···" },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName:'Login' */ "@/views/login.vue"),
    meta: { title: "请登录" },
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName:'Register' */ "@/views/register.vue"),
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
