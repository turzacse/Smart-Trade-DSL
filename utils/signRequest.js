const crypto = require('crypto');

/**
 * Generates HMAC SHA256 signature for 3Commas API
 * @param {string} payload - Full signature string: path + query + body
 * @param {string} secret - Your API secret
 * @returns {string}
 */
function signRequest(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

module.exports = signRequest;
