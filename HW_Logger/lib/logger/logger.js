import config from './config/config.js';
import { scoreLevel, level } from './constants.js';
import * as appenderStrategy from './appenders/appenderStrategy.js';

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

    for (let i = 0; i < appenders.length; i++) {
      const appender = appenderStrategy.getAppender(appenders[i]);
      appender.log(dateLog, level, category, message);
    }
  }
}

export default {
  getLogger(category) {
    return logger(category);
  },
};
