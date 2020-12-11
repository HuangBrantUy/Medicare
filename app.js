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

// patient routes
app.get('/home', requireAuth, (req, res) => res.render ('patient-pages/patient-home',  {layout: 'layouts/patient-layout'}));
app.get('/view-all-doctors', requireAuth, (req, res) => res.render ('patient-pages/patient-all-doctors',  {layout: 'layouts/patient-layout'}));
app.get('/view-doctor', requireAuth, (req, res) => res.render ('patient-pages/view-doctor',  {layout: 'layouts/patient-layout'}));
app.get('/patient-activity', requireAuth, (req, res) => res.render ('patient-pages/patient-activity',  {layout: 'layouts/patient-layout'}));
app.get('/patient-account', requireAuth, (req, res) => res.render ('patient-pages/patient-account',  {layout: 'layouts/patient-layout'}));
app.get('/patient-login', requireAuth, (req, res) => res.render ('patient-pages/patient-login',  {layout: 'layouts/patient-layout'}));
app.get('/patient-signup', requireAuth, (req, res) => res.render ('patient-pages/patient-signup',  {layout: 'layouts/patient-layout'}));

// doctor routes
app.get('/', requireAuth, (req,res)=> res.render('doctor-pages/dashboard-home', { layout: 'layouts/dashboard-layout'}));
app.get('/appointments', requireAuth, (req,res)=> res.render('doctor-pages/appointments', { layout: 'layouts/dashboard-layout'}));
app.get('/patients', requireAuth, (req,res)=> res.render('doctor-pages/patients', { layout: 'layouts/dashboard-layout'}));

// app.get('/home', requireAuth, (req, res) => res.render('dashboard-home', { layout: 'layouts/dashboard-layout'}));
// app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authroutes);


