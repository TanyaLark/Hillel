export function formatMessage(date, level, category, message, filename) {
  return `Date: ${date}, category:${category}, level:${level}, message:${JSON.stringify(
    message
  )}, filename: ${filename}\n`;
}
