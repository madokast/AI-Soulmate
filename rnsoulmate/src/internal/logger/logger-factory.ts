import { logger, consoleTransport } from "react-native-logs";
import { Platform } from "react-native";

let is_dev = false;
if (Platform.OS === 'web') {
    is_dev = true; // 确保在 web 环境中 __DEV__ 可用
} else {
    // __DEV__ 是 React Native 的一个全局变量，开发环境为 true，生产环境为 false
    is_dev = __DEV__;
}

const defaultConfig = {
// 定义日志级别
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: is_dev ? 'debug' : 'info', // 开发时记录所有，生产时只记录 info 及以上
  // 定义传输器
  transport: consoleTransport,
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
};

class Logger {
    private name: string;
    private logger: any;
    constructor(logger:any, name: string) {
        this.name = name;
        this.logger = logger;
    }
    private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...optionalParams: any[]) {
        const formattedMessage = `[${this.name}] ${message}`;
        this.logger[level](formattedMessage, ...optionalParams);
    }
    debug(message: string, ...optionalParams: any[]) {
        this.log('debug', message, ...optionalParams);
    }
    info(message: string, ...optionalParams: any[]) {
        this.log('info', message, ...optionalParams);
    }
    warn(message: string, ...optionalParams: any[]) {
        this.log('warn', message, ...optionalParams);
    }
    error(message: string, ...optionalParams: any[]) {
        this.log('error', message, ...optionalParams);
    }
}

class LoggerFactory {
    private logger: any;
    constructor(config:any) {
        this.logger = logger.createLogger(config);
    }
    getLogger(name: string): Logger {
        return new Logger(this.logger, name);
    }
}

export {defaultConfig, LoggerFactory};