interface State {
  isUploading: boolean;
  hasUploadVideo: boolean;
  completeVideoUpload: boolean;
}

interface videoinfo {
  id: string;
  title: string;
  preview_src: string;
  date: string;
  username: string;
  video_src: string;
  views: number;
  barrages: number;
  duration: string;
  barragesNum: number;
}
interface _isTouch {
  isTouch: isTouch[];
}
interface isTouch {
  id: string | null;
  isT: boolean;
}

interface EveryTitle {
  id: number;
  text: string;
}

let hhj: (string | number)[] = ["a", 1, 1, 1];

interface SametypeofTitle {
  type: string;
  data: EveryTitle[];
}

export { State, videoinfo, _isTouch, isTouch };
