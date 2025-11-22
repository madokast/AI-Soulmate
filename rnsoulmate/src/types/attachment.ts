import { decryptAES } from "../internal/crypto";

interface Attachment {
  encrypt?: string;
  path: string;
  name: string;
  media_type: string;
}

interface AttachmentData extends Attachment {
  bolb: Blob
}

export default Attachment;

export type { AttachmentData }
