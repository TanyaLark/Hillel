import * as constants from '../constants.js';
import { transform as formatMessageTXT } from './format-default-txt.js';
import { transform as formatMessageJSON } from './format-json.js';
import { transform as formatMessageCSV } from './format-csv.js';

const formatters = {
  [constants.formatters.TEXT]: formatMessageTXT,
  [constants.formatters.JSON]: formatMessageJSON,
  [constants.formatters.CSV]: formatMessageCSV,
  [undefined]: formatMessageTXT,
};
function getFormatter(formatter) {
  return formatters[formatter];
}

export { getFormatter };
