import * as helper from "../helpers/message.helper.js";

function log(date, level, category, message) {
  console.log(helper.formatMessage(date, level, category, message));
}

export default { log };
