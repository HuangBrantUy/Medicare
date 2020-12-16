const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    doctor_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    appointment_date: {
        type: String,
        required: [true, 'please enter a date']
    },
    appointment_time: {
        type: String,
        required: [true, 'please select a time']
    },
    status: {
        type: Boolean,
    }
});


//Fire a function after doc saved to db

patientSchema.post('save', function(doc, next){
    console.log('A new request has been added', doc)
    next();
});




// this model inserts to the 'patients' in the db
const Request = mongoose.model('request', patientSchema); //singular of the name in the db



module.exports = Request;