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

  if (config.appenders && config.appenders.includes('FILE')) {
    config.formatter =
      constants.formatters[logFormat] || constants.formatters.TEXT;
  }

  return config;
}

function initConfig() {
  // process.env['LOG_LEVEL'] = 'debug';
  // process.env['LOG_APPENDERS'] = 'console, file';
  // process.env['LOG_FORMAT'] = 'csv';
  // process.env['LOG_CONFIG_FILE'] = './logger.json';

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
