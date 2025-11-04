// import { AliOssFileSystem } from "./ali-oss-fs";
import { HttpAliOssFileSystem as AliOssFileSystem } from "./http-ali-oss-fs";
import { IFileSystem } from "./file-system";

import config from "../../../config.json";

const fs: IFileSystem = new AliOssFileSystem(config["ali-oss"]);

const cache = new Map<string, Blob>();

async function ReadAttachment(path: string, mediaType:string=""): Promise<Blob> {
  if (cache.has(path)) {
    return cache.get(path)!;
  }

  const fullPath = `${config.paths.attachment}/${path}`;
  const blob = await fs.read({ path: fullPath, mediaType:mediaType });
  cache.set(path, blob);
  return blob;
}

export { fs, ReadAttachment };
