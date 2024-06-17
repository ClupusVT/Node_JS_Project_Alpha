// dompurifyHelper.js
const DOMPurify = require('dompurify');

function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}

module.exports = {
  sanitizeInput,
};
