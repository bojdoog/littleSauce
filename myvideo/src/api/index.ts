import http from "../utils/request";

// 请求首页数据

export const loginAndGetInfo = (data: any) => {
  return http.post("/userInfo/api/login", data);
};

export const getUserInfo = (data: any) => {
  return http.post("/userInfo/api/getUserInfo", data);
};

export const uploadVideo = (data: any) => {
  return http.post("/upload/uploadVideo", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });
};

export const mergeChunks = (params: any) => {
  return http.get("/upload/merge", { params });
};

export const checkPoint = (params: any) => {
  return http.get("/upload/checkPoint", { params });
};

export const auditedVideo = (params: any) => {
  return http.get("/audite/auditeVideo", {
    params: {
      isPass: params.isPass,
      video_id: params.video_id,
      duration: params.duration,
    },
  });
};

export const getUnauditedVideo = () => {
  return http.get("/audite/getUnauditedVideo");
};

export const uploadVideoInfo = (data: any) => {
  return http.post("/videoInfo/uploadVideoInfo", data);
};

export const sendDmToServer = (data: any) => {
  return http.post("/video/receiveDm", data);
};

export const verifyUsername = (data: any) => {
  return http.post("/register/verifyUsername", data);
};

export const _verifyAccount = (data: any) => {
  return http.post("/register/verifyAccount", data);
};

export const handleRegister = (data: any) => {
  return http.post("/register/register", data);
};

export const updateUserInfo = (data: any) => {
  return http.post("/userInfo/updateUserInfo", data);
};

export const uploadIpAddress = (data: any) => {
  return http.post("/userInfo/api/loggerIp", data);
};
