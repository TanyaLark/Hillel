import * as constants from '../constants.js';
import { validateLogLevel, validateAppenders } from './validator.js';
import { getConfigFromFile } from './configFile.js';

const defaultConfig = {
  logLevel: constants.level.INFO,
  scoreLevel: constants.scoreLevel[constants.level.INFO],
  appenders: [constants.appender.CONSOLE],
  formatter: constants.formatters.TEXT,
};

function enrichConfig(config) {
  config.scoreLevel = constants.scoreLevel[config.logLevel];
}

function getConfigFromEnvs() {
  const logLevel = process.env.LOG_LEVEL?.toUpperCase();
  const appenders = process.env.LOG_APPENDERS?.toUpperCase();
  const logFormat = process.env.LOG_FORMAT?.toUpperCase();

  const config = {};

  if (validateLogLevel(logLevel)) {
    config.logLevel = logLevel;
  }

  if (appenders) {
    const validAppenders = validateAppenders(appenders);
    if (validAppenders.length > 0) {
      config.appenders = validAppenders;
    }
  }

  if (config.appenders && config.appenders.includes(constants.appender.FILE)) {
    config.formatter =
      constants.formatters[logFormat] || constants.formatters.TEXT;
  }

  if (
    config.appenders &&
    config.appenders.includes(constants.appender.NETWORK)
  ) {
    if (!process.env.APPENDER_PORT) {
      console.warn('No appender port provided');
      console.warn('Using default port:', constants.defaultNetworkConfig.PORT);
      process.env.APPENDER_PORT = constants.defaultNetworkConfig.PORT;
    }

    if (!process.env.APPENDER_HOST) {
      console.warn('No appender host provided');
      console.warn('Using default host:', constants.defaultNetworkConfig.HOST);
      process.env.APPENDER_HOST = constants.defaultNetworkConfig.HOST;
    }

    config.appenderPort = process.env.APPENDER_PORT;
    config.appenderHost = process.env.APPENDER_HOST;
  }

  return config;
}

function initConfig() {
  // process.env['LOG_LEVEL'] = 'debug';
  // process.env['LOG_APPENDERS'] = 'console, file';
  // process.env['LOG_FORMAT'] = 'csv';
  // process.env['LOG_CONFIG_FILE'] = './logger.json';
  // process.env.APPENDER_PORT = 3001;
  // process.env.APPENDER_HOST = 'localhost';

  const filePath = process.env.LOG_CONFIG_FILE;

  const config = Object.assign(
    defaultConfig,
    getConfigFromFile(filePath),
    getConfigFromEnvs()
  );

  enrichConfig(config);
  console.log('config ===>', config);
  return config;
}

const config = initConfig();
export default config;
