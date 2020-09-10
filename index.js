require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const mongoose = require('mongoose');
const express = require('express');

const indexRouter = require('./routes');
const cubeRouter = require('./routes/cube');
const accessoryRouter = require('./routes/accessory');
const authRouter = require('./routes/auth');

const {getUserStatus} = require('./services/user');

const app = express();

mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) =>{

    if (err){
        console.error(err);
        throw err;
    }

    console.log('Connected to database...')
});

require('./config/express')(app);

app.use('/', indexRouter);
app.use('/', cubeRouter);
app.use('/', accessoryRouter);
app.use('/', authRouter);

app.use('*', getUserStatus, (req, res) =>{
    res.render('404', {
        isLoggedIn: req.isLoggedIn
    });
});

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));