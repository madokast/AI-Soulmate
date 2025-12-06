
import { IFileSystem, FileStat, ReadOptions } from "./file-system";
import { GetObject, GetObjectOptions } from "./ali-oss-utils/requests";
import { PutObject, PutObjectOptions } from "./ali-oss-utils/requests";
import { AppendObject, AppendObjectOptions } from "./ali-oss-utils/requests";
import { HeadObject, HeadObjectOptions } from "./ali-oss-utils/requests";
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
    const { offset = 0, size = 1073741824 } = options;
    const { mediaType = "application/octet-stream" } = options;
    const range = `bytes=${offset}-${size}`; // Range: bytes=100-900

    const opts: GetObjectOptions = {
      ...this.options,
      object: options.path,
      contentType: mediaType,
      headers: {
        "Range": range
      },
      cache: options.cache,
    };
    return await GetObject(opts);
  }

  async upload(path: string, data: Blob): Promise<void> {
    const opts: PutObjectOptions = {
      ...this.options,
      object: path,
      contentType: data.type,
      data
    };
    await PutObject(opts);
  }

  async append(path: string, data: Blob): Promise<void> {
    const stat = await this.stat(path);
    const position = stat.size;
    // logger.info(`append to ${path} at ${position}`);

    const opts: AppendObjectOptions = {
      ...this.options,
      object: path,
      contentType: data.type,
      data,
      offset: position,
    };
    await AppendObject(opts);
  }

  async stat(path: string): Promise<FileStat> {
    try {
      const opts: HeadObjectOptions = {
        ...this.options,
        object: path
      };
      const headers = await HeadObject(opts);

      const contentLength = headers.get("Content-Length");
      const contentType = headers.get("Content-Type");

      const size = contentLength ? parseInt(contentLength) : 0;
      return { exists: true, size: size, mediaType: contentType || undefined };
    } catch (error) {
      logger.error(`Stat ${path} failed: ${error}`);
      return { exists: false, size: 0};
    }
  }
}

export { HttpAliOssFileSystem };