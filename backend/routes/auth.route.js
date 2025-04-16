const express = require('express');
const {
  login,
  SignUp,
  VerifyEmail,
  refresh,
  logout,
  VerifyToken,
} = require('../controllers/auth.controller');
const multer = require('multer');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

/* ====== storage for File Input ====== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/cv');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, filename);
  },
});
const upload = multer({ storage }).single('CV');

/* sign-in users */
router.post('/sign-up', upload, SignUp);

/* verify user email */
router.put('/verify-email', VerifyEmail);

router.get('/verify-token', VerifyToken);

/* sign-up users */
router.post('/login', login);

router.get('/refresh', refresh);

router.use(verifyJWT);

router.post('/logout', logout);



module.exports = router;
