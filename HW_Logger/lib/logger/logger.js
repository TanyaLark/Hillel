import config from './config/config.js';
import { scoreLevel, level } from './constants.js';
import * as appenderStrategy from './appenders/appenderStrategy.js';
import { EventEmitter } from 'node:events';

const logEventEmitter = new EventEmitter();

logEventEmitter.on('executeLog', function executeLog(level, category, message) {
  if (scoreLevel[level] <= config.scoreLevel) {
    const dateLog = new Date().toISOString();
    const appenders = config.appenders;

    appenders.forEach((appenderName) => {
      const appender = appenderStrategy.getAppender(appenderName);
      appender.log(dateLog, level, category, message);
    });
  }
});

const logger = (category) => ({
  info: (...message) => {
    logEventEmitter.emit('executeLog', level.INFO, category, message);
  },
  warn: (...message) => {
    logEventEmitter.emit('executeLog', level.WARN, category, message);
  },
  error: (...message) => {
    logEventEmitter.emit('executeLog', level.ERROR, category, message);
  },
  debug: (...message) => {
    logEventEmitter.emit('executeLog', level.DEBUG, category, message);
  },
  trace: (...message) => {
    logEventEmitter.emit('executeLog', level.TRACE, category, message);
  },
});

export default {
  getLogger(category) {
    return logger(category);
  },
};
