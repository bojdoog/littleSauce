import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
} from "axios";
import Cookie from "js-cookie";
import router from "@/router/index";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";
import envMap from "@/config/app.config";
import { refreshToken } from "@/api";

const getErrorMessage = (status: number) => {
  switch (status) {
    case 400:
      return "请求错误";
    case 401:
      return "请先登录";
    case 403:
      return "拒绝访问";
    case 404:
      return "请求出错";
    case 408:
      return "请求超时";
    case 422:
      return "资源错误";
    case 500:
      return "服务器错误";
    case 501:
      return "功能正在路上";
    case 502:
      return "网络错误";
    case 503:
      return "服务不可用";
    case 504:
      return "网络超时";
    case 505:
      return "HTTP版本不受支持";
    default:
      return `连接出错(${status})!`;
  }
};

const http: AxiosInstance = axios.create({
  // baseURL: 'http://111.231.7.251:443',
  // baseURL: 'http://127.0.0.1:443',
  baseURL: envMap["device"],
  timeout: 10000,
  headers: {},
});

// 添加请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    const token = Cookie.get("USER_TOKEN");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response: AxiosResponse) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    // // @ts-ignore
    // const SetCookieStr = response.headers.get("set-cookie");
    // console.log(SetCookieStr, "headers");

    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response) {
      const status = error.response.status;
      const wrongReason = getErrorMessage(status);
      // ElMessage({
      //   message: error.response.data.message,
      //   type: "error",
      //   duration: 3000,
      // });

      if (status === 401) {
        const _refreshToken = Cookies.get("refersh_Token");
        const uid = JSON.parse(Cookies.get("USER_INFO")).uid;
        console.log(_refreshToken, uid, "dddddddddddd");

        if (!uid || !_refreshToken) {
          router.push("login");
        }
        refreshToken({ refreshToken: _refreshToken, uid })
          .then((res) => {
            const token = res.data.token;
            Cookies.set("USER_TOKEN", token);
            // const originalRequest = error.config;
            // console.log(originalRequest, "originalRequest");
            // return http(originalRequest);
          })
          .catch((err) => {
            console.log(err);
            router.push("login");
          });
      }
    }
    return Promise.reject(error);
  }
);

export default http;
