import config from './config/config.js';
import { scoreLevel, level } from './constants.js';
import * as appenderStrategy from './appenders/appenderStrategy.js';
import { EventEmitter } from 'events';
import { getTransformStream } from './providers/streams-provider.js';

const eventEmitter = new EventEmitter();
const appenders = config.appenders;

appenders.forEach((appender) => {
  const listener = appenderStrategy.getAppender(appender).log;
  eventEmitter.on('log', listener);
});

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
  const transformStream = getTransformStream();
  if (scoreLevel[level] <= config.scoreLevel) {
    const dateLog = new Date().toISOString();
    transformStream.write(
      JSON.stringify({ date: dateLog, level, category, message })
    );
    eventEmitter.emit('log', dateLog, level, category, message);
  }
}

export default {
  getLogger(category) {
    return logger(category);
  },
};
