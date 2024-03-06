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
  let formatter = config.formatter;
  if(appender === constants.appender.CONSOLE){
    formatter = constants.formatters.TEXT;
  }
  const outputFormat = formatterStrategy.getFormatter(formatter);
  return appenders[appender](outputFormat);
}

export { getAppender };
