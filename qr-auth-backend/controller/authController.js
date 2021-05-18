const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 86400
    })
}

const handleErrors = err => {
    console.log(err.message, err.code);
    let errors = { name: '', email: '', password: '' };

    //Duplicate email handling
    if (err.code === 11000) errors["email"] = "Oopsy Daisy! You already have an account with that email! You might want to login instead!"

    if (err.message === 'Incorrect email.') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'Incorrect password.') {
        errors.password = 'The password is incorrect';
    }

    //Validate the errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;

}

const postLogin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        
        res.status(200).json({ user: user._id, token });
    } catch (err) {
        res.status(400).json({ errors: handleErrors(err) });
    }

}
const postSignup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);

        res.status(200).json({ id: user._id, token }); //Sending the token because there wont be a option to signup from the website
    } catch (err) {
        const error = handleErrors(err);
        res.status(400).json(error);
    }
}

module.exports = {
    postLogin,
    postSignup
}