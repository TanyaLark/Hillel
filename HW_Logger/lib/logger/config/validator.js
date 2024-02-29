import * as constants from '../constants.js';

export function validateLogLevel(level) {
  return level && constants.level.hasOwnProperty(level);
}

export function validateAppenders(appenders) {
  try {
    const validAppenders = appenders
      .split(',')
      .map((appender) => appender.trim())
      .filter((appender) => appender === constants.appender[appender]);
    return validAppenders;
  } catch (error) {
    console.warn('Error validating appenders', error.message);
  }
  return;
}
