import { AliOssFileSystem } from "./ali-oss-fs";
import { IFileSystem } from "./file-system";

import config from "../../../config.json";

const fs: IFileSystem = new AliOssFileSystem(config["ali-oss"]);

async function ReadAttachment(path: string): Promise<Blob> {
  const fullPath = `${config.paths.attachment}/${path}`;
  return fs.read(fullPath);
}

export { fs, ReadAttachment };
