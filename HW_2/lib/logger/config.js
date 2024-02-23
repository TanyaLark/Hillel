import * as constants from "./constants.js";
import fs from "fs";

const defaultConfig = {
  logLevel: constants.level.INFO,
  scoreLevel: constants.scoreLevel[constants.level.INFO],
  appender: constants.appender.CONSOLE,
};

function enrichConfig(config) {
  config.scoreLevel = constants.scoreLevel[config.logLevel];
}

function initConfig() {
  // process.env["LOG_LEVEL"] = "debug";
  // process.env["LOG_APPENDER"] = "file";
  // process.env["LOG_CONFIG_FILE"] = "./logger.json";

  const config = defaultConfig;

  const logLevel = process.env.LOG_LEVEL?.toUpperCase();
  const appender = process.env.LOG_APPENDER?.toUpperCase();
  const logConfigFile = process.env.LOG_CONFIG_FILE;

  if (logConfigFile) {
    try {
      const file = JSON.parse(fs.readFileSync(logConfigFile, "utf-8"));
      const fileLogLevel = file.logLevel?.toUpperCase();
      const fileAppender = file.appender?.toUpperCase();

      if (constants.level.hasOwnProperty(fileLogLevel)) {
        config.logLevel = fileLogLevel;
      }

      if (constants.appender.hasOwnProperty(fileAppender)) {
        config.appender = fileAppender;
      }
    } catch (error) {}
  }

  if (constants.level.hasOwnProperty(logLevel)) {
    config.logLevel = logLevel;
  }

  if (constants.appender.hasOwnProperty(appender)) {
    config.appender = appender;
  }

  enrichConfig(config);
  console.log("config ===>", config);
  return config;
}

const config = initConfig();
export default config;
