import * as constants from '../constants.js';
import consoleAppender from './console.js';
import fileAppender from './file.js';

const appenders = {
  [constants.appender.CONSOLE]: consoleAppender,
  [constants.appender.FILE]: fileAppender,
  [undefined]: consoleAppender,
};
function getAppender(appender) {
  return appenders[appender];
}

export { getAppender };
