
function checkSessionValidity(req, res, next) {
    // Check if a user is logged in by checking the presence of user information in the session
    if (req.session && req.session.user) {
      // Session is valid, proceed with the request
      console.log(req.session)
      next();
    } else {
      // Session is not valid, redirect to the login page or send an unauthorized response
      res.status(401).send('Unauthorized - Please log in');
    }
  }

module.exports = { checkSessionValidity };