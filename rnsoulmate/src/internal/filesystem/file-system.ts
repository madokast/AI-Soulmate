
interface IFileSystem {
  read(path:string): Promise<Blob>;
  upload(path:string, data:Blob): Promise<void>;
  append(path:string, data:Blob): Promise<void>;
}

export type { IFileSystem };
