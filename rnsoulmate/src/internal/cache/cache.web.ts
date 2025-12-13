import ICache from "./cahce-interface";
import { LoggerFactory } from "../../internal/logger/logger";

const logger = LoggerFactory.getLogger("Cache");

enum CacheType {
  String = 'string',
  Blob = 'blob',
}

class Cache<T extends string | Blob> implements ICache<T> {
  private readonly cacheName: string;
  private readonly support: boolean;
  private readonly PREFIX = '/__custom_cache_store__/'; // 用于将 key 伪装成 URL path

  constructor(name: string) {
    this.cacheName = name;
    this.support = 'caches' in self;
  }

  async get(key: string, supplier: () => Promise<T>): Promise<T> {
    // 1. 确保环境支持
    if (!this.support) {
      logger.warn('Cache API Unsupported');
      return supplier();
    }

    try {
      const cache = await caches.open(this.cacheName);
      // 将普通字符串 key 转换为 Cache API 需要的 URL 格式
      const requestUrl = this.createRequestUrl(key);

      // 2. 尝试读取缓存
      const cachedResponse = await cache.match(requestUrl);

      if (cachedResponse && cachedResponse.ok) {
        // --- 缓存命中 (Cache Hit) ---
        logger.debug(`Cache hit ${key}`);
        return await this.deserialize(cachedResponse);
      }

      // --- 缓存未命中 (Cache Miss) ---
      // 3. 执行 supplier 获取数据
      logger.debug(`Cache miss ${key}`);
      const value = await supplier();

      // 4. 将数据包装成 Response 对象并存入缓存
      const responseToCache = this.serialize(value);
      
      // 注意：put 是异步的，为了不阻塞返回值，通常可以不 await 它的完成，
      // 但为了保证数据一致性，这里选择 await (或者用 event.waitUntil 在 SW 中)
      await cache.put(requestUrl, responseToCache);

      return value;

    } catch (error) {
      logger.error(`Cache API Error: ${error}`);
      // 如果缓存系统出错，为了不影响业务，降级调用 supplier
      return supplier();
    }
  }

  // --- 内部辅助方法 ---

  /**
   * 将简单的 key 转换为符合 URL 规范的字符串
   */
  private createRequestUrl(key: string): string {
    // 这里的 domain 无所谓，主要是为了凑成一个合法的 URL 格式
    return new URL(this.PREFIX + encodeURIComponent(key), self.location.origin).href;
  }

  /**
   * 将数据包装为 Response 对象
   * 我们使用自定义 Header 'X-Data-Type' 来记录原始类型
   */
  private serialize(value: T): Response {
    let body: string | Blob;
    let type: CacheType;
    let contentType: string;

    if (Object.prototype.toString.call(value) === '[object String]') {
      body = value;
      type = CacheType.String;
      contentType = 'text/plain';
    } else {
      body = value; // Blob
      type = CacheType.Blob;
      contentType = 'application/octet-stream';
    }

    // 构造 Response
    return new Response(body, {
      headers: {
        'Content-Type': contentType,
        'X-Data-Type': type // 关键：标记数据类型以便读取时还原
      }
    });
  }

  /**
   * 从 Response 对象还原数据
   */
  private async deserialize(response: Response): Promise<T> {
    const chaheType = response.headers.get('X-Data-Type');

    if (chaheType === CacheType.String) {
      return (await response.text()) as T;
    } else if (chaheType === CacheType.Blob) {
      return (await response.blob()) as T;
    } else {
      throw new Error(`Unknow cache type ${chaheType}`);
      
    }
  }
}

export default Cache;
