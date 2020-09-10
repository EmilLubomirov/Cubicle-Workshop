const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');

module.exports = (app) => {

    app.set('view engine', '.hbs');

    app.engine( 'hbs', hbs( {
        extname: '.hbs',
        layoutsDir: __dirname + '/..' + '/views/layouts/',
        partialsDir: __dirname + '/..' + '/views/partials/'
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());
    app.use('/static', express.static('static'));

};