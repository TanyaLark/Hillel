import * as helper from "../helpers/message.helper.js";
import * as constants from "../constants.js";
import fs from "fs";
import path from "path";
import config from "../config.js";

const directory = `./log_output`;
const errorLogFileName = `app_error.js`;

function getFileName(config) {
  const fileFormat = config.logFormat.toLowerCase();
  return `app.${fileFormat}`;
}

function log(date, level, category, message) {
  const fileName = getFileName(config);
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

  fs.writeFile(filePath, logMessage, { flag: "a+" }, (err) => {
    if (err) {
      console.error("Error writing log file:", err);
      return;
    }
  });
}

function logError(logMessage) {
  const errorLogFilePath = path.join(directory, errorLogFileName);

  fs.writeFile(errorLogFilePath, logMessage, { flag: "a+" }, (err) => {
    if (err) {
      console.error("Error writing log file:", err);
      return;
    }
  });
}

export default { log };
