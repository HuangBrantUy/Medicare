const { response, request } = require('express');
const jwt = require('jsonwebtoken')
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
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

module.exports.signup_get = (req,res)=>{
    res.render('doctor-pages/signup', { title:'Sign Up | Medicare'});
}

module.exports.login_get = (req,res)=>{
    res.render('doctor-pages/login',  { title:'Login | Medicare'});
}

module.exports.signup_post = async(req,res)=>{
    const { firstName, lastName, mobileNumber, email, password   } = req.body;
    
    try{
        const doctor = await Doctor.create({ firstName, lastName, mobileNumber, email, password });
        const token = createToken(doctor._id); 
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user:doctor._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res)=>{
    const { email, password } = req.body; //destructuring 

    try{
        const doctor = await Doctor.login(email, password);
        const token = createToken(doctor._id); 
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: doctor._id});
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}


module.exports.dashboard_get = (req, res) =>{

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'valhalla');
    const docid = decoded.id;


    
    Request.find().sort({ createdAt: -1 })
        .then((request) => {
            Patient.find()
                .then((patient)=>{
                    if(request && patient){
                        res.render('doctor-pages/dashboard-home', { layout: 'layouts/dashboard-layout', requests: request, patients: patient, userid: docid }); 
                    }
                })
                .catch(err =>{
                    console.log(err);
                })
    })
        .catch(err =>{
            console.log(err);
        })
    
}


module.exports.accept_appointment = (req, res) =>{

    const patient_id = req.params.id;

    Request.findOneAndUpdate({user_id: patient_id}, {status: 'true'})
    .then(result => {
        if(result){
            res.redirect('/');
        }
      })
      .catch(err => {
        console.log(err);
      });

}

module.exports.appointments_get = (req,res) => {


    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'valhalla');
    const docid = decoded.id;

        Request.find().sort({ createdAt: -1 })
                .then((request) => {
                    Patient.find()
                        .then((patient)=>{
                            if(request && patient){
                                res.render('doctor-pages/appointments', { layout: 'layouts/dashboard-layout', requests: request, patients: patient, userid: docid }); 
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                        })
            })
                .catch(err =>{
                    console.log(err);
                })


}

module.exports.patients_get = (req,res) => {
        const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'valhalla');
    const docid = decoded.id;

        Request.find().sort({ createdAt: -1 })
                .then((request) => {
                    Patient.find()
                        .then((patient)=>{
                            if(request && patient){
                                res.render('doctor-pages/patients', { layout: 'layouts/dashboard-layout', requests: request, patients: patient, userid: docid }); 
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                        })
            })
                .catch(err =>{
                    console.log(err);
                })
}

module.exports.notifications_get = (req,res) => {


    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'valhalla');
    const docid = decoded.id;

        Request.find().sort({ createdAt: -1 })
                .then((request) => {
                    Patient.find()
                        .then((patient)=>{
                            if(request && patient){
                                res.render('doctor-pages/notifications', { layout: 'layouts/dashboard-layout', requests: request, patients: patient, userid: docid });
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                        })
            })
                .catch(err =>{
                    console.log(err);
                })


}