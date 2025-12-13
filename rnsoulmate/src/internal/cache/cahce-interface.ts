
interface ICache<T extends string | Blob> {
  /**
   * 获取缓存值，如果缓存不存在则调用 supplier 获取值并缓存
   * @param key 缓存的键
   * @param supplier 缓存未命中时的提供者函数
   */
  get(key: string, supplier: () => Promise<T>): Promise<T>;
}

export default ICache;
