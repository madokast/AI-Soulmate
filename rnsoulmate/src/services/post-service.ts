import PostType from "../types/post";
import { IFileSystem } from "../internal/filesystem/file-system";
import config from "../../config.json";
import MediaType from "../types/media-types";
import fs from "../internal/filesystem/current";
import Attachment from "../types/attachment";
import { LoggerFactory } from "../internal/logger/logger";
import { decryptAES, encryptAES } from "../internal/crypto";

const logger = LoggerFactory.getLogger('PostService')

class PostService {
  private readonly fs: IFileSystem;
  private allPost: PostType[] | null;
  public constructor() {
    this.fs = fs;
    this.allPost = null;
  }
  public ReadAll(callback: (posts: PostType[]) => void) {
    if (this.allPost !== null) {
      callback(this.allPost);
      return;
    }
    this.fs.read({
      path: config.paths.content,
      mediaType: MediaType.JsonL
    }
    ).then(postsBlob => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const text = reader.result as string;
          const posts = text
            .split('\n')                          // 1. 按换行符分割成字符串数组
            .filter(line => line.trim() !== '')   // 2. 过滤掉空行
            .map(line => JSON.parse(line));       // 3. 将每一行JSON字符串解析为对象
          posts.forEach(post => decryptPost(post));
          logger.info(`Read ${posts?.length} posts`);
          this.allPost = posts;
          callback(posts);
        }
      }
      reader.readAsText(postsBlob);
    })

  }
  public async Post(content: string, attachments: Attachment[], encrypt: boolean): Promise<void> {
    if (this.allPost === null) {
      throw Error("Posts are not loaded yet.");
    }
    const post: PostType = {
      id: this.allPost?.length + 1,
      encrypt: undefined,
      content: content,
      created_at: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    const appendingPost = {...post};
    if (encrypt) {
      const aes = config.aes.at(-1); // newest
      if (!aes) {
        throw Error("No AES key found.");
      }
      const encryptedContent = await encryptAES(new Blob([appendingPost.content]), aes.key);
      appendingPost.content = await encryptedContent.text();
      appendingPost.encrypt = aes.name;
    }

    const post_json = JSON.stringify(appendingPost, null, '') // 不换行，不转义
    const data = new Blob([post_json, '\n'], { type: MediaType.JsonL });
    await this.fs.append(config.paths.content, data);

    this.allPost?.push(post);
  }
  public Retain(count: number) {
    this.ReadAll((allPost) => {
      this.allPost = allPost;
      this.allPost = this.allPost.slice(0, count);
      this.allPost.forEach(post => encryptPost(post));
      const posts = this.allPost.map(post => JSON.stringify(post, null, '')).join('\n');
      const data = new Blob([posts, '\n'], { type: MediaType.JsonL });

      this.fs.append(config.paths.content + ".bak1", data).then(() => {
        logger.info(`Retain ${count} posts`);
      });
    });
  }
}

async function decryptPost(post: PostType): Promise<void> {
  if (post.encrypt) {
    const aes = config.aes.find(a => a.name === post.encrypt);
    if (!aes) {
      throw Error("No AES key found.");
    }
    const encryptedContent = new Blob([post.content]);
    post.content = await decryptAES(encryptedContent, aes.key).then(decrypted => decrypted.text());
  }
}

async function encryptPost(post: PostType): Promise<void> {
  if (post.encrypt) {
    const aes = config.aes.find(a => a.name === post.encrypt);
    if (!aes) {
      throw Error("No AES key found.");
    }
    const encryptedContent = await encryptAES(new Blob([post.content]), aes.key);
    post.content = await encryptedContent.text();
  }
}

const postService = new PostService();
// postService.Retain(4);

export default postService;
