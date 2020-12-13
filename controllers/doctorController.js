const { response } = require('express');
const jwt = require('jsonwebtoken')
const Doctor = require('../models/Doctor');

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
    const { email, password } = req.body;
    
    try{
        const doctor = await Doctor.create({ email, password });
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
    res.render('layouts/dashboard-layout');
}