import RNFS from 'react-native-fs';
import ICache from "./cahce-interface";
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("Cache");

enum CacheType {
  String = 'string',
  Blob = 'blob',
}

// 定义元数据结构
interface CacheMeta {
  cacheType: CacheType;
  mimeType?: string; // 建议记录 mimeType，以便恢复 Blob 时准确
}

class Cache<T extends string | Blob> implements ICache<T> {
  private baseDir: string;

  constructor(name: string) {
    if (name.startsWith("/")) {
      name = name.substring(1);
    }
    // Android: /data/user/0/com.app/cache/{name}
    this.baseDir = `${RNFS.CachesDirectoryPath}/${name}`;
    this.init();
  }

  // 初始化目录
  private async init() {
    // 增加错误捕获，防止权限问题导致 crash
    try {
      const exists = await RNFS.exists(this.baseDir);
      if (!exists) {
        await RNFS.mkdir(this.baseDir);
      }
    } catch (e) {
      logger.error(`Failed to init cache dir: ${e}`);
    }
  }

  async get(key: string, supplier: () => Promise<T>): Promise<T> {
    const fileId = this.hashKey(key);
    const metaPath = this.metaFilePath(fileId);
    const dataPath = this.binFilePath(fileId);

    try {
      // 1. 检查文件是否存在
      if (await RNFS.exists(metaPath) && await RNFS.exists(dataPath)) {
        const metaContent = await RNFS.readFile(metaPath, 'utf8');
        const meta: CacheMeta = JSON.parse(metaContent);
        
        logger.debug(`Cache hit ${key}`);
        return await this.readData(dataPath, meta);
      }
    } catch (e) {
      logger.warn(`Cache read error for ${key}: ${e}`);
      // 读取失败，清理残留
      await this.clearEntry(fileId);
    }

    // --- 缓存未命中 ---
    logger.debug(`Cache miss ${key}`);
    const value = await supplier();

    // 2. 异步写入 (不要 await，提高响应速度)
    this.writeData(fileId, value).catch(err => {
      logger.error(`Write cache failed for ${key}: ${err}`);
    });

    return value;
  }

  // --- 写入逻辑 ---
  private async writeData(fileId: string, value: T): Promise<void> {
    const metaPath = this.metaFilePath(fileId);
    const dataPath = this.binFilePath(fileId);

    let meta: CacheMeta;
    
    if (typeof value === 'string') {
      meta = { cacheType: CacheType.String };
      await RNFS.writeFile(dataPath, value, 'utf8');
    } else {
      const blob = value as Blob;
      meta = { 
        cacheType: CacheType.Blob,
        mimeType: blob.type 
      };
      
      // 1. 转为 DataURL (格式: "data:image/png;base64,iVBORw...")
      const dataUrl = await this.blobToDataUrl(blob);
      
      // 2. 提取纯 Base64 部分 (去掉逗号前的头部)
      const base64Data = dataUrl.split(',')[1];

      // 3. 关键修改：使用 'base64' 编码写入
      // RNFS 会自动解码 Base64 并将二进制数据写入磁盘
      // 这样磁盘上就是一张真正的图片/文件，而不是文本文件
      if (base64Data) {
        await RNFS.writeFile(dataPath, base64Data, 'base64');
      }
    }

    // 写入元数据
    await RNFS.writeFile(metaPath, JSON.stringify(meta), 'utf8');
  }

  // --- 读取逻辑 ---
  private async readData(dataPath: string, meta: CacheMeta): Promise<T> {
    if (meta.cacheType === CacheType.String) {
      const content = await RNFS.readFile(dataPath, 'utf8');
      return content as T;
    } else if (meta.cacheType === CacheType.Blob) {
      // 关键修改：使用 file:// 协议 + fetch 读取
      // 这避免了将文件内容读入 JS 字符串内存，极大降低 OOM 风险
      const fileUrl = `file://${dataPath}`;
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      // 恢复原始类型 (可选，但推荐)
      if (meta.mimeType && blob.type !== meta.mimeType) {
        return blob.slice(0, blob.size, meta.mimeType) as T;
      }
      return blob as T;
    } else {
      throw new Error(`Unknown type ${meta.cacheType}`);
    }
  }

  private hashKey(key: string): string {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16);
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = (e) => reject(e);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
  
  private async clearEntry(fileId: string) {
     try {
       // 使用 unlink 安全删除，避免 Promise.all 在其中一个失败时抛出异常导致另一个没删掉
       if(await RNFS.exists(this.metaFilePath(fileId))) 
          await RNFS.unlink(this.metaFilePath(fileId));
       
       if(await RNFS.exists(this.binFilePath(fileId)))
          await RNFS.unlink(this.binFilePath(fileId));
     } catch(e) { 
       logger.warn(`Cache clear ${fileId} error: ${e}`);
     }
  }

  private metaFilePath(fileId: string): string {
    return `${this.baseDir}/${fileId}.meta`;
  }

  private binFilePath(fileId: string): string {
    return `${this.baseDir}/${fileId}.bin`;
  }
}

export default Cache;