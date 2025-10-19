
/**
 * 获取当前时间，格式为 hh:mm:ss.sss
 * @returns 当前时间字符串，格式为 hh:mm:ss.sss
 */
function nowTime():string {
  const date = new Date();
  // 获取时、分、秒，不足两位补0
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  // 拼接为 hh:mm:ss 格式
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export { nowTime };