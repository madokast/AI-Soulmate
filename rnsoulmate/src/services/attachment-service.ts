import PostType from "../types/post";
import Attachment from "../types/attachment";
import { AttachmentData } from "../types/attachment";
import { IFileSystem } from "../internal/filesystem/file-system";
import config from "../../config.json";
import fs from "../internal/filesystem/current";
import Media from "../types/media";

class AttachmentService {
  private readonly fs:IFileSystem;
  public constructor() {
    this.fs = fs;
  }
  public async Read(attachment: Attachment) : Promise<AttachmentData>  {
    const data = await this.fs.read({
      path: `${config.paths.attachment}/${attachment.path}`,
      mediaType: attachment.media_type,
    })
    return {
      ...attachment,
      bolb: data
    }
  }
  public async ReadAll(post: PostType): Promise<AttachmentData[]> {
    if (!post.attachments) {
      return [];
    }
    return await Promise.all(post.attachments.map(this.Read));
  }
  public async Post(media: Media, encrypt:boolean): Promise<Attachment> {
    if (encrypt) {
      throw new Error("Encrypt attachment is not supported");
    }

    let suffix = ""
    if (media.name.includes(".")) {
      suffix = media.name.substring(media.name.lastIndexOf("."));
    }
    const path = randomWord() + "-" + Date.now().toString() + suffix;

    const fullPath = `${config.paths.attachment}/${path}`;
    const blob = await media.blob;
    await this.fs.upload(fullPath, blob);
    return {
      path: path,
      name: media.name,
      media_type: blob.type,
      encrypt: undefined,
    }
  }
}

function randomWord(length = 6) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

const attachmentService = new AttachmentService();

export default attachmentService;
