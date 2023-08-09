/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue3-video-play";

declare module "@/utils/request";

declare module "js-cookie";

interface Window {
  createObjectURL: (blob: Blob) => string;
}
