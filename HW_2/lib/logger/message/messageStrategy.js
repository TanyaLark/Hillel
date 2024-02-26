import * as constants from "../constants.js";
import config from "../../logger/config.js";
import formatMessage from "./message-text.js";
import formatMessageJSON from "./message-json.js";

const message = {
  [constants.logFormat.TEXT]: formatMessage,
  [constants.logFormat.JSON]: formatMessageJSON,
  [undefined]: formatMessage,
};
function getMessage() {
  return message[config.logFormat];
}

export { getMessage };
