import {Config} from '../constants/Config';

type LogTags = {
  [key: string]: Primitive;
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const captureMessage = (
  level: any,
  context: string,
  message: string,
  extraTags?: LogTags,
): void => {};

export const captureException = (
  context: string,
  error: unknown,
  extraTags?: LogTags,
): void => {};

const formatMessage = (
  fileName: string,
  functionName: string,
  message: string,
): string => {
  const t = new Date();
  return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}::${fileName}#${functionName}:${message}`;
};

const logMessage = (
  level: LogLevel,
  fileName: string,
  functionName: string,
  message: string,
  ...args: unknown[]
): void => {
  if (!fileName || !message) {
    console.warn('Invalid log message format, skipping');
    return;
  }
  //problem with jest
  //functionName ||= fileName
  functionName || (functionName = fileName);
  const formatted = formatMessage(fileName, functionName, message);

  if (__DEV__) {
    console[level](formatted, ...args);
    return;
  }

  // Send error, warn, info logs to Sentry
  if (Config.enableSentry) {
    if (level === 'error') {
      captureException(`${fileName}#${functionName}`, message);
    } else if (level === 'warn') {
      captureMessage('warning', `${fileName}#${functionName}`, message);
    } else if (level === 'info') {
      captureMessage('info', `${fileName}#${functionName}`, message);
    }
  }
};

export const Logger = {
  debug: (
    fileName: string,
    functionName: string,
    message: string,
    ...args: unknown[]
  ): void => logMessage('debug', fileName, functionName, message, ...args),
  info: (
    fileName: string,
    functionName: string,
    message: string,
    ...args: unknown[]
  ): void => logMessage('info', fileName, functionName, message, ...args),
  warn: (
    fileName: string,
    functionName: string,
    message: string,
    ...args: unknown[]
  ): void => logMessage('warn', fileName, functionName, message, ...args),
  error: (
    fileName: string,
    functionName: string,
    message: string,
    ...args: unknown[]
  ): void => logMessage('error', fileName, functionName, message, ...args),
};
