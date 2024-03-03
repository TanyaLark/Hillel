import * as constants from '../constants.js';
import config from '../config/config.js';
import * as formatterStrategy from '../formatters/formatterStrategy.js';
import consoleAppender from './console.js';
import fileAppender from './file.js';

const appenders = {
  [constants.appender.CONSOLE]: consoleAppender,
  [constants.appender.FILE]: fileAppender,
  [undefined]: consoleAppender,
};
function getAppender(appender) {
  const outputFormat = formatterStrategy.getFormatter(config.formatter);
  return appenders[appender](outputFormat);
}

export { getAppender };
