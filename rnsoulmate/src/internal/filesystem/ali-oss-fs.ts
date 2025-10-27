
import { IFileSystem, FileStat } from "./file-system";
import OSS from 'ali-oss';
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("AliOssFileSystem");

class AliOssFileSystem implements IFileSystem {
  private client: OSS;
  constructor(options: OSS.Options) {
    this.client = new OSS(options);
  }
  async read(path: string, offset:number=0, size:number=1073741824 /*1G*/): Promise<Blob> {
    const result = await this.client.get(path, {
      headers: {
        Range: `bytes=${offset}-${size}`
      }
    })
    logger.debug(`Read ${path}, length: ${result.content?.byteLength} b`);
    return new Blob([result.content], { type: "application/octet-stream" });
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
