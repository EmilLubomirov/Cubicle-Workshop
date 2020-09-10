const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const authCookieName = 'auth';

const isPasswordValid = (password, repeatPassword) =>{

    const minLength = 4;
    return (password.length >= minLength) && (password === repeatPassword)
};

const generatePassword = async (plainPassword) => {

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainPassword, salt);
};

const generateToken = (user) =>{

    const {_id} = user;

    const payloads = {_id};
    const options = {expiresIn: '5d'};
    const secret = config.secretPhrase;

    return jwt.sign(payloads, secret, options);
};

const saveUser = async (req, res) => {

    const {
        username,
        password,
        repeatPassword
    } = req.body;

    if (!isPasswordValid(password, repeatPassword)){
        return;
    }

    const hashedPassword = await generatePassword(password);

    try {

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        setUserAuthCookie(user, res);
        return user;
    }

    catch (e) {
        console.error(e);
    }
};

const setUserAuthCookie = (user, res) =>{

    const token = generateToken(user);
    res.cookie(authCookieName, token);
};

const authenticateUser = async (req, res) =>{

    const {
        username,
        password,
    } = req.body;

    const user = await User.findOne({username});

    if (!user){
        return;
    }

    const arePasswordsEqual = await bcrypt.compare(password, user.password);

    if (!arePasswordsEqual){
        return;
    }

    setUserAuthCookie(user, res);
    return user;
};

const getUserStatus = (req, res, next) =>{

    const token = req.cookies[authCookieName];

    if (token){
        req.isLoggedIn = true;

        const decodedToken = jwt.verify(token, config.secretPhrase);
        req.userId = decodedToken._id;
    }

    else{
        req.isLoggedIn = false;
        req.userId = null;
    }

    next();
};

const authAccess = (req, res, next) =>{

    const token = req.cookies[authCookieName];

    if (!token){
        return res.redirect('/');
    }

    try {
        jwt.verify(token, config.secretPhrase);
        next();
    }

    catch (e) {
        return res.redirect('/');
    }
};

module.exports = {
    saveUser,
    authenticateUser,
    authAccess,
    getUserStatus
};