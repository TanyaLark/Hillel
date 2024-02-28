let headersAdded = false;

function formatMessage(date, level, category, message) {
  const escapedMessage = JSON.stringify(message).replace(/"/g, '""');

  if (!headersAdded) {
    headersAdded = true;
    return `Date,category,level,message\n${date},${category},${level},"${escapedMessage}"\n`;
  }

  return `${date},${category},${level},"${escapedMessage}"\n`;
}

export default { formatMessage };
