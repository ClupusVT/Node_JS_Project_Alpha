// cacheMiddleware.js

function generateRandomCookieValue() {
  const randomNumber = Math.random().toString().substring(2);
  return randomNumber;
}

function noCacheMiddleware(req, res, next) {
  // Disable caching for all responses
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  // Alternatively, set an expiry date in the past
  // res.header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
  // Set a unique ETag for each response
  res.setHeader('X-Frame-Options', 'DENY');
  ////CORS control
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('ETag', `"${Date.now()}"`);

  // Content Security Policy (CSP) directives
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "default-src 'none'; script-src 'none'; img-src 'none';"
  //   // Add more directives as needed for your application
  // );
  const {username} = req.body;   
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // If no cookie, create a new one
    console.log(username)
    const newCookieValue = username || generateRandomCookieValue();
    res.cookie('cookieName', newCookieValue, { maxAge: 900000, httpOnly: true });
    console.log('Cookie created successfully:', newCookieValue);
  } else {
    // The cookie already exists
    console.log('Cookie exists:', cookie);
  }
  next(); // Continue to the next middleware
}

module.exports = { noCacheMiddleware };
//module.exports = { Cookie_Handle };
  