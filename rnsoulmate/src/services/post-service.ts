import PostType from "../types/post";
import { IFileSystem } from "../internal/filesystem/file-system";
import config from "../../config.json";
import MediaType from "../types/media-types";
import fs from "../internal/filesystem/current";
import Attachment from "../types/attachment";
import { LoggerFactory } from "../internal/logger/logger";

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
    }
    this.fs.read({
      path: config.paths.posts,
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
          logger.info(`Read ${posts?.length} posts`);
          this.allPost = posts;
          callback(posts);
        }
      }
      reader.readAsText(postsBlob);
    })

  }
  public async Post(content: string, attachments: Attachment[], encrypt: boolean): Promise<void> {
    if (encrypt) {
      throw Error("Encrypt is not supported yet.")
    }

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

    const post_json = JSON.stringify(post, null, '') // 不换行，不转义
    const data = new Blob([post_json, '\n'], { type: MediaType.JsonL });
    await this.fs.append(config.paths.posts, data);
    this.allPost?.push(post);
  }
  public Retain(count: number) {
    this.ReadAll((allPost) => {
      this.allPost = allPost;
      this.allPost = this.allPost.slice(0, count);
      const posts = this.allPost.map(post => JSON.stringify(post, null, '')).join('\n');
      const data = new Blob([posts, '\n'], { type: MediaType.JsonL });

      this.fs.append(config.paths.posts + ".bak1", data).then(() => {
        logger.info(`Retain ${count} posts`);
      });
    });
  }
}

const postService = new PostService();

export default postService;
