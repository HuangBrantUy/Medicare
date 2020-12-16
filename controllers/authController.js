const { response } = require('express');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Request = require('../models/Request');

//Error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email:'', password:''};

    //incorrect email
    if(err.message === 'Incorrect email'){
        errors.email = 'The email does not exsist';
    }


    //incorrect email
    if(err.message === 'Incorrect password'){
        errors.password = 'Incorrect Password';
    }

    //Duplicate email error code
    if(err.code === 11000){
        errors.email = 'The email is already taken'
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'valhalla', {
        expiresIn:  maxAge     
    });

}


// Start of Patient Pages
module.exports.paient_activity = (req,res) => {
    res.render('patient-pages/patient-activity',  {layout: 'layouts/patient-layout', title: 'Activity Log'});
}

module.exports.patient_account = (req,res) => {
    res.render('patient-pages/patient-account',  {layout: 'layouts/patient-layout', title: 'Profile'});
}


module.exports.doctor_details = (req, res) => {
    const id = req.params.id;
    Doctor.findById(id)
     .then((result)=>{
         res.render('patient-pages/view-doctor', {layout: 'layouts/patient-layout', doctor:result, title: 'View Doctor'})
     })
     .catch(err =>{
         console.log(err);
     })
}


module.exports.view_all_doctors = (req, res) =>{
    Doctor.find().sort({ createdAt: -1 })
        .then((result)=>{
            res.render('patient-pages/patient-all-doctors', { layout: 'layouts/patient-layout', doctors: result, title:'All Doctors'})
        })
        .catch(err => {
            console.log(err);
        })
}


module.exports.patient_index = (req, res) => {
    Doctor.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('patient-pages/patient-home',  { layout: 'layouts/patient-layout', doctors: result, title: 'Home | Medicare' })
        })
        .catch(err => {
            console.log(err);
          });
}


module.exports.book_appointment_post = (req,res) => {
    const {doctor_id, appointment_date, appointment_time} = req.body


//decode token to get user id
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'valhalla');
    const user_id = decoded.id;

//hard code the status false = pending
    const status = false;

    try {
        const request = Request.create({doctor_id, user_id, appointment_date, appointment_time, status});
        res.redirect('/home');
    } catch (err) {
       res.status(400);
    }
    console.log(res);
}
//End of Patient Pages



// Authentication Pages (Sign in, Sign up, Log out)\

module.exports.login_get = (req,res)=>{
    res.render('patient-pages/patient-login',  { layout: 'layouts/patient-layout', title:'Log in | Medicare'});
}
module.exports.signup_get = (req,res)=>{
    res.render('patient-pages/patient-signup', { title: 'Sign Up | Medicare' ,layout: 'layouts/patient-layout'});
}

module.exports.signup_post = async(req,res)=>{
    const { email, password } = req.body;
    
    try{
        const patient = await Patient.create({ email, password });
        const token = createToken(patient._id); 
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user:patient._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res)=>{
    const { email, password } = req.body; //destructuring 

    try{
        const patient = await Patient.login(email, password);
        const token = createToken(patient._id); 
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: patient._id});
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/patient-login');
}


