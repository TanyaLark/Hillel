export function formatMessage(date, level, category, message, filename) {
  return JSON.stringify({ date, level, category, message, filename }) + '\n';
}
