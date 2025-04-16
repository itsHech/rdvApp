var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

const UserRouter = require('./routes/users.route');
const PosteRouter = require('./routes/poste.route');
const AuthRouter = require('./routes/auth.route');
const DomaineRouter = require('./routes/domaine.route');
const port = process.env.PORT;

const cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public/cv')));
app.use('/public', express.static(path.join(__dirname, 'public/domaine_icon')));
app.use('/public', express.static(path.join(__dirname, 'public/company_logo')));

app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  })
);

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(
      `DB_CONNECTED SUCCESSFULLY!! \n *** Hosting on http://localhost:${port} ***`
    );
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/users', UserRouter);
app.use('/api/poste', PosteRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/domaine', DomaineRouter);

module.exports = app;
