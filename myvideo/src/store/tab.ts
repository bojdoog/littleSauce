import type { State } from "../types/types";
export default {
  state() {
    return {
      isUploading: false,
      hasUploadVideo: false,
      completeVideoUpload: false,
    };
  },
  getters: {},
  mutations: {
    openInputVideoInfo(state: State) {
      state.isUploading = true;
    },
    changeHasUploadVideo(state: State, val: boolean) {
      state.hasUploadVideo = val;
    },
    changeCompleteVideoUpload(state: State, val: boolean) {
      state.completeVideoUpload = val;
    },
  },
};
