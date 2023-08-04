import prodConfig from "./prod.config";
import devpConfig from "./dev.config";


const envMap: any = {
  devp: devpConfig,
  prod: prodConfig,
  // test: testConfig,
  // pre: preConfig,
};

const env = process.env.RELEASE_ENV || "devp";
// export default envMap[env];

export default envMap[env];
