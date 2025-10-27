
interface Attachment {
  encrypt?: string;
  path: string;
  media_type: string;
}

interface Post {
  id: number; // from 1
  encrypt?: string;
  content: string;
  created_at: number; // timestamp
  attachments?: Attachment[];
}
