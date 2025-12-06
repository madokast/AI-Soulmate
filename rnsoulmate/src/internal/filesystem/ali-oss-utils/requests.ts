import { now2YYYYMMDDTHHmmssZ } from "../../data-time";
import { authorizationV4, Method, HeaderKey } from "./signer-v4";
import { AuthorizeOptions, MustHeader } from "./signer-v4";
import { LoggerFactory } from "../../logger/logger";
import readStream2buffer from "./readable-stream-tool";

const logger = LoggerFactory.getLogger("requests");

const defaultContentType = "application/octet-stream";

interface BaseOptions {
  bucket: string, // bucket 名字
  region: string, // 存储桶所在地域 oss-cn-shenzhen
  object: string; // 资源名。两者构造 UriEncode("/bucket/object")
  contentType?: string;
  headers?: {
    [key: string]: string;
  }

  accessKeyId:string
  accessKeySecret:string
}

interface GetObjectOptions extends BaseOptions {
  cache: boolean
}

interface PutObjectOptions extends BaseOptions {
  data: Blob
}

interface AppendObjectOptions extends PutObjectOptions {
  data: Blob
  offset: number
}

interface HeadObjectOptions extends BaseOptions {}

async function GetObject(opts:GetObjectOptions):Promise<Blob> {
  const url = `https://${opts.bucket}.${opts.region}.aliyuncs.com/${opts.object}`;
  const method = Method.GET;
  const date = now2YYYYMMDDTHHmmssZ();
  const headers:MustHeader = {
    [HeaderKey.ContentType]: opts.contentType || defaultContentType
  };
  const authorizeOptions:AuthorizeOptions = {
    method: method,
    region: opts.region,
    bucket: opts.bucket,
    object: opts.object,
    headers: headers,
    date: date,
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
  }
  const authorization = authorizationV4(authorizeOptions);

  const response = await fetch(url, {
    method: method,
    headers: {
      ...(opts.headers || {}),
      ...headers,
      [HeaderKey.Authorization]: authorization,
      [HeaderKey.XOssDate]: date,
      [HeaderKey.CacheControl]: opts.cache ? "public, max-age=31536000, s-maxage=2592000, immutable" : "no-store"
    }
  });
  if (!response.ok) {
    const message = `${method} ${url} ${response.status} ${response.statusText}`
    throw new Error(message);
  }
  return response.blob();
}

async function PutObject(opts: PutObjectOptions):Promise<void> {
  const url = `https://${opts.bucket}.${opts.region}.aliyuncs.com/${opts.object}`;
  const method = Method.PUT;
  const date = now2YYYYMMDDTHHmmssZ();
  const headers:MustHeader = {
    [HeaderKey.ContentType]: opts.contentType || defaultContentType
  };
  const authorizeOptions:AuthorizeOptions = {
    method: method,
    region: opts.region,
    bucket: opts.bucket,
    object: opts.object,
    headers: headers,
    date: date,
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
  }
  const authorization = authorizationV4(authorizeOptions);

  const response = await fetch(url, {
    method: method,
    headers: {
      ...(opts.headers || {}),
      ...headers,
      [HeaderKey.Authorization]: authorization,
      [HeaderKey.XOssDate]: date,
    },
    body: opts.data,
  });
  if (!response.ok) {
    const result = await response.json();
    logger.error(`HTTP ${response.status} ${response.statusText} ${JSON.stringify(result)}`);
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
}

async function AppendObject(opts: AppendObjectOptions) {
  const url = `https://${opts.bucket}.${opts.region}.aliyuncs.com/${opts.object}?append&position=${opts.offset}`;
  const method = Method.POST;
  const date = now2YYYYMMDDTHHmmssZ();
  const headers:MustHeader = {
    [HeaderKey.ContentType]: opts.contentType || defaultContentType
  };
  const authorizeOptions:AuthorizeOptions = {
    method: method,
    region: opts.region,
    bucket: opts.bucket,
    object: opts.object,
    query: {
      "append": null,
      "position": opts.offset.toString()
    },
    headers: headers,
    date: date,
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
  }
  const authorization = authorizationV4(authorizeOptions);

  const response = await fetch(url, {
    method: method,
    headers: {
      ...(opts.headers || {}),
      ...headers,
      [HeaderKey.Authorization]: authorization,
      [HeaderKey.XOssDate]: date,
    },
    body: opts.data,
  });
  if (!response.ok) {
    const resultBlob = await response.blob();
    const result = await resultBlob.text();
    logger.error(`HTTP ${response.status} ${response.statusText} ${JSON.stringify(result)}`);
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
}

async function HeadObject(opts:HeadObjectOptions): Promise<Headers> {
  const url = `https://${opts.bucket}.${opts.region}.aliyuncs.com/${opts.object}`;
  const method = Method.HEAD;
  const date = now2YYYYMMDDTHHmmssZ();
  const headers:MustHeader = {};
  const authorizeOptions:AuthorizeOptions = {
    method: method,
    region: opts.region,
    bucket: opts.bucket,
    object: opts.object,
    headers: headers,
    date: date,
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
  }
  const authorization = authorizationV4(authorizeOptions);

  const response = await fetch(url, {
    method: method,
    headers: {
      ...(opts.headers || {}),
      ...headers,
      [HeaderKey.Authorization]: authorization,
      [HeaderKey.XOssDate]: date,
    }
  });
  if (!response.ok) {
    const message = `${method} ${url} ${response.status} ${response.statusText}`
    throw new Error(message);
  }

  // Content-Length, Content-Type
  return response.headers;
}

export {GetObject, PutObject, AppendObject, HeadObject};
export type {GetObjectOptions, PutObjectOptions, AppendObjectOptions, HeadObjectOptions};