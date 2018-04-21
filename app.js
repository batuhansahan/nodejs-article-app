const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')


mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', () => {
  console.log('Connnected to mongoDB');
});

// Check for db errors
db.on('error', err => {
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load View Enginer
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator());﻿

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next) => {
  res.locals.user = req.user || null;
  next();
})

// Home route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});



// Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start server
app.listen(3000, () => {
  console.log('on port 3000');
});
