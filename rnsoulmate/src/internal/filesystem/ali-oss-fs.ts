
import { IFileSystem, FileStat, ReadOptions } from "./file-system";
import OSS from 'ali-oss';
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("AliOssFileSystem");

class AliOssFileSystem implements IFileSystem {
  private client: OSS;
  constructor(options: OSS.Options) {
    this.client = new OSS(options);
  }
  async read(options: ReadOptions): Promise<Blob> {
    const { offset = 0, size = 1073741824} = options;
    const { mediaType = "application/octet-stream"} = options;
    const result = await this.client.get(options.path, {
      headers: {
        Range: `bytes=${offset}-${size}`
      }
    })
    logger.debug(`Read ${options.path}, length: ${result.content?.byteLength} b`);
    return new Blob([result.content], { type: mediaType });
  }
  async upload(path: string, data: Blob): Promise<void> {
    await this.client.put(path, data);
  }
  async append(path: string, data: Blob): Promise<void> {
    const stat = await this.stat(path);
    const position = stat.size;
    await this.client.append(path, data, {
      position: position.toString(),
    });
  }
  async stat(path: string): Promise<FileStat> {
    try {
      const stat = await this.client.head(path);
      
      const rawContentLength = (stat.res.headers as any)['content-length'];
      const contentLength = rawContentLength ? parseInt(rawContentLength) : 0;
      const size = isNaN(contentLength) ? 0 : contentLength;

      logger.debug(`Stat ${path}, size: ${JSON.stringify(stat)} b`);
      return { exists: true, size: size };
    } catch (error) {
      return { exists: false, size: 0 };
    }
  }
}

export { AliOssFileSystem };
