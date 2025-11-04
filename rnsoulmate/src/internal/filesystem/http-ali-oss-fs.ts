
import { IFileSystem, FileStat, ReadOptions } from "./file-system";
import { GetObject, GetObjectOptions } from "./ali-oss-utils/requests";
import { LoggerFactory } from "../../internal/logger/logger";


const logger = LoggerFactory.getLogger("HttpAliOssFileSystem");

interface Options {
    region: string,
    accessKeyId: string,
    accessKeySecret: string,
    bucket: string,
}

class HttpAliOssFileSystem implements IFileSystem {
  private options: Options;
  constructor(options: Options) {
    this.options = options;
  }
  async read(options: ReadOptions): Promise<Blob> {
    const { offset = 0, size = 1073741824} = options;
    const { mediaType = "application/octet-stream"} = options;
    const range = `bytes=${offset}-${size}`; // Range: bytes=100-900

    const opts: GetObjectOptions = {
      ...this.options,
      object: options.path,
      contentType: mediaType,
      headers: {
        "Range": range
      }
    };
    return await GetObject(opts);
  }
  async upload(path: string, data: Blob): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async append(path: string, data: Blob): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async stat(path: string): Promise<FileStat> {
    throw new Error("Method not implemented.");
  }
}

export { HttpAliOssFileSystem };