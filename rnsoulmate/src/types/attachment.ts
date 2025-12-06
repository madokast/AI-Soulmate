import { decryptAES } from "../internal/crypto";

interface Attachment {
  encrypt?: string;
  path: string;
  name: string;
  media_type: string;
}

interface AttachmentData extends Attachment {
  // blob or data-url
  raw: Blob | string
}

export default Attachment;

export type { AttachmentData }
