import * as helper from "../message/message-text.js";

function log(date, level, category, message) {
  console.log(helper.formatMessage(date, level, category, message));
}

export default { log };
