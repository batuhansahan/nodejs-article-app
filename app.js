const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TodoApp');
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

// Home route
app.get('/', (req, res) => {
  Article.find({}, (err, articles)=> {
    if(err) {
      console.log(err);
    }else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

// Add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add article'
  });
});

// Start server
app.listen(3000, () => {
  console.log('on port 3000');
});
