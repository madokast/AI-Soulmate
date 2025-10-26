
import { IFileSystem } from "./file-system";
import OSS from 'ali-oss';
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("AliOssFileSystem");

class AliOssFileSystem implements IFileSystem {
  private client: OSS;
  constructor(options: OSS.Options) {
    this.client = new OSS(options);
  }
  async read(path: string): Promise<Blob> {
    const result = await this.client.get(path, {
      headers: {
        Range: 'bytes=0-1073741824' // 1GB
      }
    })
    logger.debug(`Read ${path}, size: ${result.content?.byteLength} b`);
    return new Blob([result.content], { type: "application/octet-stream" });
  }
  async upload(path: string, data: Blob): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async append(path: string, data: Blob): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export { AliOssFileSystem };
