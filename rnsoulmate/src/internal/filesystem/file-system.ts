
interface FileStat {
  exists: boolean;
  size: number;
}

interface IFileSystem {
  read(path:string): Promise<Blob>;
  upload(path:string, data:Blob): Promise<void>;
  append(path:string, data:Blob): Promise<void>;
  stat(path:string): Promise<FileStat>;
}

export type { IFileSystem, FileStat };
