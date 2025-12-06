
interface FileStat {
  exists: boolean;
  size: number;
  mediaType?: string;
}

interface ReadOptions {
  path: string;
  offset?: number;
  size?: number;
  mediaType?: string;
  cache: boolean
}

interface IFileSystem {
  read(options: ReadOptions): Promise<Blob>;
  upload(path:string, data:Blob): Promise<void>;
  append(path:string, data:Blob): Promise<void>;
  stat(path:string): Promise<FileStat>;
}

export type { IFileSystem, FileStat, ReadOptions };
