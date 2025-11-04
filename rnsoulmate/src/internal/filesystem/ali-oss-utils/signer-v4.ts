import CryptoJS from "crypto-js";

enum Method {
  PUT = "PUT",
  GET = "GET",
  POST = "POST",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
}

interface Item<K, V> {
  key: K;
  value: V;
}

enum HeaderKey {
  ContentType = "content-type", // 示例 text/plain
  ContentMD5 = "content-md5", // 示例 ICy5YqxZB1uWSwcVLSNLcA==
  XOssDate = "x-oss-date", // ISO8601标准时间格式 20250328T101048Z
  XOssContentSha256 = "x-oss-content-sha256", // UNSIGNED-PAYLOAD // 目前只支持UNSIGNED-PAYLOAD
  Authorization = "Authorization",
}

const XOssContentSha256Value = "UNSIGNED-PAYLOAD";

interface MustHeader {
  [HeaderKey.ContentType]?: string;
  [HeaderKey.ContentMD5]?: string;
  [HeaderKey.XOssDate]?: string;
  [HeaderKey.XOssContentSha256]?: string;
}

interface AuthorizeOptions {
  /**
   * method + "\n" +
   * Canonical URI + "\n" +
   * Canonical Query String + "\n" +
   * Canonical Headers + "\n" +
   * Additional Headers + "\n" +
   * Hashed PayLoad
   */


  method: Method;
  bucket: string; // bucket 名字
  object: string; // 资源名。两者构造 UriEncode("/bucket/object")
 
  // query 参数
  // 先对 k 和 v 都进行 URI 编码，然后按照 k 排序
  // 然后用 = 连接 k 和 v，用 & 连接 kv 对
  // 如果只有 k 没有 v，则只有 URI 编码的 k
  // query 为空时，对应空串 ""
  query?: Map<string, string | null>;

  /**
   * 签名时参与签名的 headers
   * // 必须存在且参与签名
   * x-oss-content-sha256:UNSIGNED-PAYLOAD // 目前只支持UNSIGNED-PAYLOAD
   * x-oss-date:20250328T101048Z // ISO8601标准时间格式
   * // 请求头中如果存在则参与签名：Content-Type 和 Content-MD5，以及 x-oss 开头的请求头
   * content-type:text/plain
   * content-md5:ICy5YqxZB1uWSwcVLSNLcA==
   * // AdditionalHeaders 指定的头，现在不支持
   */
  headers: MustHeader;


  // 存储桶所在地域 oss-cn-shenzhen，使用时需要去除 'oss-'
  region: string;

  // 20250328T101048Z // ISO8601标准时间格式
  date: string;

  accessKeyId:string
  accessKeySecret:string
}

function makeCanonicalRequest(opts: AuthorizeOptions): string {
  // Hashed PayLoad 目前只支持取值为UNSIGNED-PAYLOAD
  const hashedPayload = XOssContentSha256Value;

  // Canonical URI
  const canonicalURI = encodeString(`/${opts.bucket ? `${opts.bucket}/` : ''}${opts.object || ''}`).replace(/%2F/g, '/') // Canonical URI

  // Canonical Query String
  const canonicalQueries: Item<string, string|null>[] = [];
  if (opts.query) {
    for (const [key, value] of Object.entries(opts.query)) {
      const canonicalKey = encodeString(key);
      const canonicalValue = value ? encodeString(value) : null;
      canonicalQueries.push({
        key: canonicalKey,
        value: canonicalValue,
      });
    }
    // 字典序
    canonicalQueries.sort((a, b) => a.key.localeCompare(b.key));
  }
  const canonicalQueryString = canonicalQueries.map(query => {
    return query.value ? `${query.key}=${query.value}` : query.key;
  }).join("&");

  // Canonical Headers
  const canonicalHeaderItems: Item<string, string>[] = [];
  opts.headers[HeaderKey.XOssDate] = opts.date;
  opts.headers[HeaderKey.XOssContentSha256] = hashedPayload;
  for (const [key, value] of Object.entries(opts.headers)) {
    canonicalHeaderItems.push({
      key: key.toLowerCase(),
      value: value.trim(),
    });
  }
  canonicalHeaderItems.sort((a, b) => a.key.localeCompare(b.key));
  const canonicalHeaderString = canonicalHeaderItems.map(item => `${item.key}:${item.value}\n`).join('');

  // Additional Headers
  const additionalHeaders = "" // content-disposition;content-length


  const signContent: string[] = [opts.method, canonicalURI, canonicalQueryString, canonicalHeaderString, additionalHeaders, hashedPayload]

  /*
GET
/bucket/a/b/1.txt

content-md5:ICy5YqxZB1uWSwcVLSNLcA==
content-type:application/json
x-oss-content-sha256:UNSIGNED-PAYLOAD
x-oss-date:20250328T101048Z


UNSIGNED-PAYLOAD
  */
  return signContent.join('\n')
}

function makeStringToSign(region:string, date:string, canonicalRequest:string): string {
  const product = 'oss';
  const dateOnly = date.split('T')[0];

  const stringToSign = [
    'OSS4-HMAC-SHA256',
    date, // ISO8601 UTC:yyyymmdd'T'HHMMss'Z'
    // this.getCredential(date.split('T')[0], region, undefined, product), // Scope

    `${dateOnly}/${region}/${product}/aliyun_v4_request`,

    // crypto.createHash('sha256').update(canonicalRequest).digest('hex') // Hashed Canonical Request
    CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex)
  ];

  return stringToSign.join('\n');
}

function authorizationV4(opts: AuthorizeOptions): string {
  const product = 'oss';
  const region = opts.region.startsWith('oss-') ? opts.region.substring(4) : opts.region;

  const canonicalRequest = makeCanonicalRequest(opts);
  const stringToSign = makeStringToSign(region, opts.date, canonicalRequest);
  const onlyDate = opts.date.split('T')[0];
  const signatureValue = makeSignatureV4(opts.accessKeySecret, onlyDate, region, stringToSign);
  
  const tempCredential = `${onlyDate}/${region}/${product}/aliyun_v4_request`;
  const additionalHeadersValue = ""; // 不支持 additionalHeaders

  return `OSS4-HMAC-SHA256 Credential=${opts.accessKeyId}/${tempCredential},${additionalHeadersValue}Signature=${signatureValue}`;
}

function makeSignatureV4(accessKeySecret:string, date:string, region:string, stringToSign:string) {
  const product = 'oss';

  // const signingDate = crypto.createHmac('sha256', `aliyun_v4${accessKeySecret}`).update(date).digest();
  // const signingRegion = crypto.createHmac('sha256', signingDate).update(region).digest();
  // const signingOss = crypto.createHmac('sha256', signingRegion).update(product).digest();
  // const signingKey = crypto.createHmac('sha256', signingOss).update('aliyun_v4_request').digest();
  // const signatureValue = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const signingDate = CryptoJS.HmacSHA256(date, `aliyun_v4${accessKeySecret}`);
  const signingRegion = CryptoJS.HmacSHA256(region, signingDate);
  const signingOss = CryptoJS.HmacSHA256(product, signingRegion);
  const signingKey = CryptoJS.HmacSHA256('aliyun_v4_request', signingOss);
  const signatureValue = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

  return signatureValue;
};

/*===================================== utils ================================ */

function encodeString(str: string) {
  // encodeURIComponent 是 JS 原生的 URI 组件编码函数，但其编码范围是 ** 排除部分 “安全字符”** 的：
  // 根据 URI 规范，!、'、(、)、* 这 5 个字符属于 “非保留字符”，encodeURIComponent 不会对它们进行编码（会原样保留）。

  //通过正则 /:[!'()*]/g 匹配这些字符，并手动转换为编码形式
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/*
const now = now2YYYYMMDDTHHmmssZ();
  logger.info(now)
  const cr = authorizationV4({
    method: Method.GET,
    bucket: config['ali-oss'].bucket,
    object: 'test/from-python-sdk-v2-202509282026.txt',
    headers: {
      [MustHeaderKey.ContentType]: 'text/plain',
      // [MustHeaderKey.XOssContentSha256]: 'UNSIGNED-PAYLOAD',
      // [MustHeaderKey.ContentMD5]: 'ICy5YqxZB1uWSwcVLSNLcA==',
    },
    region: config['ali-oss'].region,
    date: now,
    accessKeyId:config['ali-oss'].accessKeyId,
    accessKeySecret:config['ali-oss'].accessKeySecret,
  })
  logger.info(cr);
*/

export {authorizationV4, HeaderKey, Method};
export type {AuthorizeOptions, MustHeader};