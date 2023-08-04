import http from "../utils/request";

// 请求首页数据

export const getUserInfo = (data: any) => {
  return http.post("/userInfo/api/login", data);
};

export const uploadVideo = (data: any) => {
  return http.post("/upload/uploadVideo", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const auditedVideo = (params: any) => {
  return http.get("/upload/auditedVideo", {
    params: {
      isPass: params.isPass,
      video_id: params.video_id,
      duration: params.duration,
    },
  });
};

export const getUnauditedVideo = () => {
  return http.get("/upload/getUnauditedVideo");
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
