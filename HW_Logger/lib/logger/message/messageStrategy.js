import * as constants from "../constants.js";
import config from "../config.js";
import formatMessage from "./message-text.js";
import formatMessageJSON from "./message-json.js";
import formatMessageCSV from "./message-csv.js";

const message = {
  [constants.logFormat.TEXT]: formatMessage,
  [constants.logFormat.JSON]: formatMessageJSON,
  [constants.logFormat.CSV]: formatMessageCSV,
  [undefined]: formatMessage,
};
function getMessage() {
  return message[config.logFormat];
}

export { getMessage };
