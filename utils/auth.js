// import jsonwebtoken so we can verify JWTS
const jwt = require('jsonwebtoken');

// This middleware checks if the user has a valid JWT
function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization;

  // if there is no auth header, the user is not sending a token
  if(!authHeader) {
    return res.status(401).json({
      message: 'Access token required',
    });
  }

  const token = authHeader.split(' ')[1];

  if(!token) {
    return res.status(401).json({
      message: 'Access token required',
    });
  }

  try {
// check if the jwt is valid using out secret key
const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = decoded;

next();
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid or expired token',
    });
  }
}

module.exports = authenticateToken;