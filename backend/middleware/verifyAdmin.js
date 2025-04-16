const verifyAdmin = async (req, res, next) => {
  if (!req.isAdmin)
    return res.status(403).json({ message: 'Admin authentification required' });
  if (req.isAdmin === true) {
    next();
  }
};

module.exports = verifyAdmin;
