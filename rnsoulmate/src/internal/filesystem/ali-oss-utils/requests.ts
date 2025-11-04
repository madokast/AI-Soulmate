import { now2YYYYMMDDTHHmmssZ } from "../../data-time";
import { authorizationV4, Method, HeaderKey } from "./signer-v4";
import { AuthorizeOptions, MustHeader } from "./signer-v4";


const defaultContentType = "application/octet-stream";

interface GetObjectOptions {
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
    }
  });
  return await response.blob();
}


export {GetObject};
export type {GetObjectOptions};