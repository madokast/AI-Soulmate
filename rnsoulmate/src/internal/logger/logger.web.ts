import { LoggerFactory, defaultConfig } from "./logger-factory";

const loggerFactory = new LoggerFactory(defaultConfig);

export { loggerFactory as LoggerFactory };
