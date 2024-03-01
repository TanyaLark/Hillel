import * as constants from '../constants.js';
import config from '../config/config.js';
import formatMessageTXT from './format-default-txt.js';
import formatMessageJSON from './format-json.js';
import formatMessageCSV from './format-csv.js';

const formatters = {
  [constants.formatters.TEXT]: formatMessageTXT,
  [constants.formatters.JSON]: formatMessageJSON,
  [constants.formatters.CSV]: formatMessageCSV,
  [undefined]: formatMessageTXT,
};
function getFormatter() {
  return formatters[config.formatter];
}

export { getFormatter };
