const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const requireDocAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //check if token exist
    if(token){
        jwt.verify(token, 'valhalla', (err, decodedToken)=>{
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } 
    else {
        res.redirect('/login');
    }

}

// check current user
const checkDoctor = (req, res, next) => {       
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, 'valhalla' , async (err, decodedToken)=> {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                let user = await Doctor.findById(decodedToken.id);
                res.locals.user = user;  //session
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}



module.exports = { requireDocAuth, checkDoctor };

