const express = require('express');
const mongoose = require('mongoose');
const authroutes = require('./routes/authroutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const app = express();
const expressLayouts = require('express-ejs-layouts');


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.use(expressLayouts);
app.set('layout', 'layouts/layout')
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://viking:Password2000@medicare.4airm.mongodb.net/Node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000), console.log('port is open'))
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('login', { title:'Login on Medicare / Medicare'} ));
app.get('/home', requireAuth, (req, res) => res.render('dashboard-home', { layout: 'layouts/dashboard-layout'}));
// app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authroutes);


