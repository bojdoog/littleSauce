import prodConfig from "./prod.config";
import devpConfig from "./dev.config";

const envMap: any = {
  devp: devpConfig,
  prod: prodConfig,
};

const env = process.env.RELEASE_ENV || "devp";

export default envMap[env];
