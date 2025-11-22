// import { AliOssFileSystem } from "./ali-oss-fs";
import { HttpAliOssFileSystem as AliOssFileSystem } from "./http-ali-oss-fs";
import { IFileSystem } from "./file-system";

import config from "../../../config.json";

const fs: IFileSystem = new AliOssFileSystem(config["ali-oss"]);

export default fs;
