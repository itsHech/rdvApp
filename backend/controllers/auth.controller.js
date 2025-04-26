const Users = require('../models/users.models');
const Token = require('../models/token.models');
const ValidateUser = require('../validation/users.validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var dontenv = require('dotenv');
dontenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3d',
  });
};
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PSWD,
  },
});

const SignUp = async (req, res) => {
  const { errors, isValid } = ValidateUser(req.body, req.file ? req.file : '');

  try {
    if (!isValid) {
      return res.status(404).json(errors);
    }

    // Check if user already exists
    await Users.findOne({ email: req.body.email }).then(async (exist) => {
      if (exist) {
        errors.email = 'User Exist';
        return res.status(404).json(errors);
      } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        // Create the user document in the Users collection
        const user = await Users.create({
          name: req.body.name,
          email: req.body.email,
          civility: req.body.civility,
          password: hash,
          birthday: req.body.birthday,
          governorate: req.body.governorate,
          phone: req.body.phone,
          profession: req.body.profession,
          CV: req.file ? req.file.path : '',
        });

        // If the user is a professional, create the corresponding professional record
        if (req.body.profession && req.body.profession.toLowerCase() === 'professional') {
          const professionalData = {
            name: req.body.name,
            email: req.body.email,
            specialty: req.body.specialty,  // Assuming 'specialty' is part of the request body
            availableDates: req.body.availableDates, // Assuming this is an array of available dates
          };

          await Professional.create(professionalData);
        }

        // Generate a token for the user
        const token = await Token.create({
          userId: user._id,
          token: createToken(user._id),
        });

        // Send verification email to user
        var mailOptions = {
          from: `Emna Recruitement`,
          to: user.email,
          subject: 'Verify your email',
          html: `<h2> Hi Mr/Md ${user.name}, Thanks for registering on our site </h2>
                 <h4> Please verify your email by clicking on the link below to continue... </h4> 
                 <a href="https://emna-recruitment.tn/email-verification?token=${token.token}">Click Here!!</a>`,
        };
        
        // Sending the email
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.log(error);
          else console.log('Verification email is sent to your email');
        });

        res.status(201).json({ token, user });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    await Token.findOne({ token: req.query.token }).then(async (t_exist) => {
      if (!t_exist) res.status(404).send('Email does not exist');
      else {
        await Users.findOneAndUpdate(
          { _id: t_exist.userId },
          { isVerified: true },
          { new: true }
        ).then(async (res) => {
          if (res) await Token.deleteOne({ token: req.query.token });
        });
        res.status(200).send('Email Successfully Verified!!');
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    await Users.findOne({ email: req.body.email }).then(async (exist) => {
      if (exist) {
        if (exist.isVerified === true) {
          const match = await bcrypt.compare(req.body.password, exist.password);
          if (match) {
            const accessToken = jwt.sign(
              {
                UserInfo: {
                  email: exist.email,
                  isAdmin: exist.isAdmin,
                },
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '20m' }
            );
            const refreshToken = jwt.sign(
              { email: exist.email },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '2d' }
            );
            res.cookie('jwt', refreshToken, {
              httpOnly: true, // accessible only by web server
              secure: true, //https
              sameSite: 'None', // cross-site-cookie
              maxAge: 7 * 24 * 60 * 1000, // 7 days
            });
            const email = exist.email;
            res.json({ accessToken, email });
          } else {
            res.status(403).json({ message: 'Invalid Password' });
          }
        } else {
          res.status(203).json({
            message: 'Please verify your email',
            text: 'by clicking the link sent to your mail',
          });
        }
      } else {
        res.status(404).json({ message: 'Invalid Credentials' });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies) return res.status(401).json({ message: 'Unauthorized' });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: err });

      const user = await Users.findOne({ email: decoded.email });
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2d' }
      );
      res.status(200).json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.status(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

const VerifyToken = (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(405).json({ message: 'Authentification Expired' });
      res.status(200).json({ message: 'Token Verified' });
    }
  );
};

module.exports = {
  login,
  SignUp,
  VerifyEmail,
  refresh,
  logout,
  VerifyToken,
};
