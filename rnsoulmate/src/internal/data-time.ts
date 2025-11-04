
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

// 补0函数：确保数字为两位数（如 9 → "09"）
function padZero(num:number) : string {
  return num < 10 ? '0' + num : num.toString();
}

// 毫秒时间戳转日期时间 "YYYY-MM-DD HH:MM:SS" 格式
function timestampToDateTime(timestamp:number) : string {
  // 校验时间戳有效性（必须是数字且不为NaN）
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    return '无效的时间戳';
  }
  
  const date = new Date(timestamp); // 用时间戳创建Date实例
  
  const year = date.getFullYear(); // 年（4位）
  const month = padZero(date.getMonth() + 1); // 月（0-11 → 1-12，补0）
  const day = padZero(date.getDate()); // 日（1-31，补0）
  const hour = padZero(date.getHours()); // 时（0-23，补0）
  const minute = padZero(date.getMinutes()); // 分（0-59，补0）
  const second = padZero(date.getSeconds()); // 秒（0-59，补0）
  
  // 拼接为 "YYYY-MM-DD HH:MM:SS" 格式
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 获取当前时间 ISO8601格式 YYYYMMDDTHHmmssZ
function now2YYYYMMDDTHHmmssZ():string {
  const now = new Date();
  const isoString = now.toISOString();
  const formattedTime = isoString
    .replace(/-/g, '')    // 移除日期中的-
    .replace(/:/g, '')    // 移除时间中的:
    .replace(/\.\d{3}/, ''); // 移除.和后面的3位毫秒数
  return formattedTime;
}

export { nowTime, timestampToDateTime, now2YYYYMMDDTHHmmssZ };