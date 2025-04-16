const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorisation token required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Forbidden' });
    req.user = decoded.UserInfo.email;
    req.isAdmin = decoded.UserInfo.isAdmin;
    next();
  });
};

module.exports = verifyJWT;
