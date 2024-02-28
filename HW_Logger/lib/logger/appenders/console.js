import messageHelper from '../formatters/format-default-txt.js';

function log(date, level, category, message) {
  console.log(messageHelper.formatMessage(date, level, category, message));
}

export default { log };
