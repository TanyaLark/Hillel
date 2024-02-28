import messageHelper from "../message/message-text.js";

function log(date, level, category, message) {
  console.log(messageHelper.formatMessage(date, level, category, message));
}

export default { log };
