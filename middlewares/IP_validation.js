// middlewares/inputValidation.js
function isValidIpAddress_level2(ipAddress) {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ipAddress);
}

module.exports = isValidIpAddress_level2;
