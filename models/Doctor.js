const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')




const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true, 
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'minimum password length is 6 characters']
    },
});


//Fire a function after doc saved to db

doctorSchema.post('save', function(doc, next){
    console.log('New user was created and saved', doc)
    next();
});


// Fire a function after doc saved to db

doctorSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user

doctorSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');

    } throw Error('Incorrect email')
}


// this model inserts to the 'users' in the db
const Doctor = mongoose.model('doctor', doctorSchema); //singular of the name in the db



module.exports = Doctor;