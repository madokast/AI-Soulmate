import PostType from "../types/post";
import Attachment from "../types/attachment";
import { AttachmentData } from "../types/attachment";
import { IFileSystem } from "../internal/filesystem/file-system";
import config from "../../config.json";
import fs from "../internal/filesystem/current";
import Media from "../types/media";
import { decryptAES, encryptAES } from "../internal/crypto";

const EncryptedSuffix = ".aes";

class AttachmentService {
  private readonly fs:IFileSystem;
  public constructor() {
    this.fs = fs;
  }
  public async Read(attachment: Attachment) : Promise<AttachmentData>  {
    let data = await this.fs.read({
      path: `${config.paths.attachment}/${attachment.path}`,
      mediaType: attachment.media_type,
    })
    if (attachment.encrypt) {
      if (!attachment.path.endsWith(EncryptedSuffix)) {
        throw Error("Attachment path does not end with encrypted suffix.");
      }
      const aes = config.aes.find(a => a.name === attachment.encrypt);
      if (!aes) {
        throw Error("No AES key found.");
      }
      data = await decryptAES(data, aes.key);
    }
    return {
      ...attachment,
      blob: data
    }
  }
  public async ReadAll(post: PostType): Promise<AttachmentData[]> {
    if (!post.attachments) {
      return [];
    }
    return await Promise.all(post.attachments.map(this.Read));
  }
  public async Post(media: Media, encrypt:boolean): Promise<Attachment> {
    let blob = await media.blob;
    let encryptedSuffix = "";
    let encryptName = undefined;
    if (encrypt) {
      const aes = config.aes.at(-1);
      if (!aes) {
        throw Error("No AES key found.");
      }
      blob = await encryptAES(blob, aes.key);
      encryptedSuffix = EncryptedSuffix;
      encryptName = aes.name;
    }

    let suffix = ""
    if (media.name.includes(".")) {
      suffix = media.name.substring(media.name.lastIndexOf("."));
    }
    const path = randomWord() + "-" + Date.now().toString() + suffix + encryptedSuffix;

    const fullPath = `${config.paths.attachment}/${path}`;
    await this.fs.upload(fullPath, blob);
    return {
      path: path,
      name: media.name,
      media_type: blob.type,
      encrypt: encryptName,
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
