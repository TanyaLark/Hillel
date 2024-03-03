import config from './config/config.js';
import { scoreLevel, level } from './constants.js';
import * as appenderStrategy from './appenders/appenderStrategy.js';
import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

const logger = (category) => ({
  info: (...message) => {
    executeLog(level.INFO, category, message);
  },
  warn: (...message) => {
    executeLog(level.WARN, category, message);
  },
  error: (...message) => {
    executeLog(level.ERROR, category, message);
  },
  debug: (...message) => {
    executeLog(level.DEBUG, category, message);
  },
  trace: (...message) => {
    executeLog(level.TRACE, category, message);
  },
});

function executeLog(level, category, message) {
  if (scoreLevel[level] <= config.scoreLevel) {
    const dateLog = new Date().toISOString();
    const appenders = config.appenders;

    appenders.forEach((appender) => {
      const listener = appenderStrategy.getAppender(appender).log;
      eventEmitter.once('log', listener);
    });

    eventEmitter.emit('log', dateLog, level, category, message);
  }
}

export default {
  getLogger(category) {
    return logger(category);
  },
};
