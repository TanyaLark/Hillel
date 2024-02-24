import * as helper from "../helpers/message.helper.js";
import * as constants from "../constants.js";
import fs from "fs";
import path from "path";

const directory = `./log_output`;
const fileName = `app.log`;
const errorLogFileName = `app_error.js`;

function log(date, level, category, message) {
  const filePath = path.join(directory, fileName);
  const logMessage = `${helper.formatMessage(
    date,
    level,
    category,
    message
  )}\n`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (level === constants.level.ERROR) {
    logError(logMessage);
  }

  fs.writeFileSync(filePath, logMessage, { flag: "a+" }, (err) => {
    if (err) {
      console.error("Error writing log file:", err);
      return;
    }
  });
}

function logError(logMessage) {
  const errorLogFilePath = path.join(directory, errorLogFileName);

  fs.writeFileSync(errorLogFilePath, logMessage, { flag: "a+" }, (err) => {
    if (err) {
      console.error("Error writing log file:", err);
      return;
    }
  });
}

export default { log };
