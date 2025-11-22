import Attachment from "./attachment";

interface Post {
  id: number; // from 1
  encrypt?: string;
  content: string;
  created_at: number; // timestamp
  attachments?: Attachment[];
}

export default Post 
