const express = require('express');
const {
  DeleteUser,
  FindAllUsers,
  UpdateCV,
  SeachUsers,
  FindUserResume,
} = require('../controllers/users.controller');
const { VerifyEmail } = require('../controllers/auth.controller');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const multer = require('multer');

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

router.use(verifyJWT);
/* verify user */
router.get('/:id/verify/:token', VerifyEmail);

/* update user */
router.put('/cv/:id', upload, UpdateCV);

router.get('/resume', FindUserResume);
router.use(verifyAdmin);

/* show all users */
router.get('/', verifyAdmin, FindAllUsers);


/* show searched users */
router.get('/:search', SeachUsers);

/* delete user */
router.delete('/', DeleteUser);

module.exports = router;
