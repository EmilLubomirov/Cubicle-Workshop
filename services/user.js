const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {getCubeById} = require('../services/cubes');

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const authCookieName = 'aid';

const isPasswordValid = (password, repeatPassword) =>{

    const minLength = 8;
    const regex = /[a-zA-Z0-9]+/;

    return (RegExp(regex).test(password)) &&
            (password.length >= minLength) &&
            (password === repeatPassword);
};

const generatePassword = async (plainPassword) => {

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainPassword, salt);
};

const generateToken = (user) =>{

    const {_id} = user;

    const payloads = {_id};
    const secret = config.secretPhrase;

    return jwt.sign(payloads, secret);
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

    try {

        const hashedPassword = await generatePassword(password);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        setUserAuthCookie(user, res);
        return user;
    }

    catch (e) {
        return undefined;
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

const getAuthToken = (req) =>{
    return req.cookies[authCookieName];
};

const getDecodedAuthToken = (token, secret) =>{
    return jwt.verify(token, secret);
};

const getUserStatus = (req, res, next) =>{

    const token = getAuthToken(req);

    if (token){
        req.isLoggedIn = true;
        const decodedToken = getDecodedAuthToken(token, config.secretPhrase);
        req.userId = decodedToken._id;
    }

    else{
        req.isLoggedIn = false;
        req.userId = null;
    }

    next();
};

const authAccess = (req, res, next) =>{

    const token = getAuthToken(req);

    if (!token){
        return res.redirect('/');
    }

    try {
        const decodedToken = getDecodedAuthToken(token, config.secretPhrase);
        req.userId = decodedToken._id;
        next();
    }

    catch (e) {
        return res.redirect('/');
    }
};

const creatorAccess = async (req, res, next) =>{

    const token = getAuthToken(req);

    if (!token){
        return res.redirect('/');
    }

    try {

        const decodedToken = getDecodedAuthToken(token, config.secretPhrase);
        const userId = decodedToken._id;
        const cubeId = req.params.id;

        const cube = await getCubeById(cubeId);

        if (cube.creatorId.valueOf().toString() !== userId.valueOf().toString()){
            return res.redirect(301, '/');
        }

        req.cube = cube;
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
    getUserStatus,
    creatorAccess
};