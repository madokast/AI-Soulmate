import { fileAsyncTransport, consoleTransport } from "react-native-logs";
import RNFS from 'react-native-fs';
import { Platform } from "react-native";

import { LoggerFactory, defaultConfig } from "./logger-factory";

const configInNative = {
  transport: (props:any) => {
    // 总是使用文件传输器
    fileAsyncTransport(props);
    // 如果是开发环境，额外使用控制台传输器
    if (Platform.OS !== 'web' && __DEV__) {
      consoleTransport(props);
    }
  },
  transportOptions: {
    FS: RNFS, // 必须传入文件系统模块
    filePath: RNFS.DocumentDirectoryPath, // 将日志文件存储在应用文档目录
    fileName: 'app.log', // 日志文件名
    // 你还可以配置更高级的选项，如文件轮转
  }
}

const mergedConfig = {...defaultConfig, ...configInNative};

const loggerFactory = new LoggerFactory(mergedConfig);

export { loggerFactory as LoggerFactory };
