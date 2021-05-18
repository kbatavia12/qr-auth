const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'You forgot to introduce yourself! Please give us your name'],
    },
    email: {
        type: String,
        required: [true, 'Oops Daisy! Looks like your email is empty!'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Oops Daisy! Looks like your password is empty!'],
        minLength: [6, `Sorry, we don't allow such short passwords, it should atleast be 6 characters`]
    }
})



userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }
        throw Error('Incorrect password.')

    }

    throw Error('Incorrect email.')
}



userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


module.exports = model('user', userSchema)