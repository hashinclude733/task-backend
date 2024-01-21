const jwt = require('jsonwebtoken');
const SECRET = 'SECr3t'; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        console.error('Error verifying token:', err.message);
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
      }

      console.log('Token verified successfully. Decoded user:', user);
      req.user = user;
      next();
    });
  } else {
    console.error('Missing token in request headers.');
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
};

module.exports = { authenticateToken };
