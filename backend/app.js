require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// ✅ Load Environment Variables & Check Important Keys
if (!process.env.JWT_SECRET) {
    console.error("⚠️ Warning: JWT_SECRET is missing in .env file");
}
if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing in .env file");
    process.exit(1); // Stop the app if MongoDB URI is missing
}
// ✅ Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

/*
// ✅ Session (must be before routes)
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Provide a fallback
    resave: false,
    saveUninitialized: false
}));

// ✅ Set View Engine
app.set('view engine', 'ejs');

*/
// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Stop app if DB connection fails
    });

// ✅ Routes
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const appointmentRoutes = require('./routes/appointment');
const professionalRoutes = require('./routes/professional');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  }); 

app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/', mainRoutes);
app.use('/professionals', professionalRoutes);


// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));