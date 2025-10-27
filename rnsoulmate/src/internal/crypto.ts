import CryptoJS from "crypto-js";

/**
 * 使用 AES-CBC 加密 Blob 数据。
 * 输出的 Blob 格式为：[16字节的IV][加密后的数据]
 * @param {Blob} data 要加密的原始 Blob 数据
 * @param {string} base64key Base64 编码的 128 位（16字节）密钥
 * @returns {Promise<Blob>} 包含 IV 和密文的加密后 Blob
 */
async function encryptAES(data: Blob, base64key: string): Promise<Blob> {
  // 1. 解析密钥并校验长度 (AES-256)
  const key = CryptoJS.enc.Base64.parse(base64key);
  if (key.sigBytes !== 32) {
    throw new Error(`Invalid key length ${key.sigBytes}. Key must be 16 bytes for AES-256.`);
  }
  
  // 2. 生成一个随机的 16 字节（128位）的初始化向量 (IV)
  const iv = CryptoJS.lib.WordArray.random(16);

  // 3. 将输入的 Blob 转换为 WordArray
  const dataArrayBuffer = await data.arrayBuffer();
  const dataWordArray = CryptoJS.lib.WordArray.create(dataArrayBuffer);

  // 4. 执行加密
  const encrypted = CryptoJS.AES.encrypt(dataWordArray, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  // 5. 将 IV 和密文拼接在一起
  // 这是关键一步：解密时需要知道加密时用了哪个IV
  const combined = iv.concat(encrypted.ciphertext);

  // 6. 将拼接后的 WordArray 转换回 ArrayBuffer
  const combinedArrayBuffer = wordArrayToArrayBuffer(combined);

  // 7. 创建并返回最终的 Blob
  // application/octet-stream 是通用的二进制数据类型
   return new Blob([combinedArrayBuffer], { type: "application/octet-stream" });
}

/**
 * 使用 AES-CBC 解密 Blob 数据。
 * 假设输入的 Blob 格式为：[16字节的IV][加密后的数据]
 * @param {Blob} encryptedData 包含 IV 和密文的加密 Blob
 * @param {string} base64key Base64 编码的 128 位（16字节）密钥
 * @returns {Promise<Blob>} 解密后的原始 Blob
 */
async function decryptAES(encryptedData: Blob, base64key: string): Promise<Blob> {
  // 1. 解析密钥
  const key = CryptoJS.enc.Base64.parse(base64key);
  if (key.sigBytes !== 32) {
    throw new Error(`Invalid key length ${key.sigBytes}. Key must be 16 bytes for AES-256.`);
  }

  // 2. 将加密的 Blob 转换为 WordArray
  const encryptedArrayBuffer = await encryptedData.arrayBuffer();
  const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedArrayBuffer);

  // 3. 从数据中分离 IV 和密文
  // IV 是前 16 字节 (128 bits)
  const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4));
  iv.sigBytes = 16; // 明确指定IV的长度

  // 密文是剩余的部分
  const cipherText = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4));
  cipherText.sigBytes = encryptedWordArray.sigBytes - 16;
  
  // 4. 执行解密
  // 注意：CryptoJS 的 decrypt 方法需要一个特殊的 CipherParams 对象
  const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: cipherText
  });
  
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 5. 检查解密是否成功（如果密钥错误或数据损坏，sigBytes 可能为0）
  if (decrypted.sigBytes <= 0) {
      throw new Error("Decryption failed. The key may be incorrect or the data corrupted.");
  }

  // 6. 将解密后的 WordArray 转换为 ArrayBuffer
  const decryptedArrayBuffer = wordArrayToArrayBuffer(decrypted);
  
  // 7. 创建并返回解密后的 Blob
  // 注意：我们无法知道原始的MIME类型，所以返回一个通用的Blob
  return new Blob([decryptedArrayBuffer], { type: "application/octet-stream" });
}

/**
 * 辅助函数：将 CryptoJS WordArray 转换为 ArrayBuffer
 * @param {CryptoJS.lib.WordArray} wordArray
 * @returns {ArrayBuffer}
 */
function wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
  const { words, sigBytes } = wordArray;
  const buffer = new ArrayBuffer(sigBytes);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    view[i] = byte;
  }

  return buffer;
}


export { encryptAES, decryptAES };
