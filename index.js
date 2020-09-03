const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const mongoose = require('mongoose');
const express = require('express');

const indexRouter = require('./routes');
const cubeRouter = require('./routes/cube');
const accessoryRouter = require('./routes/accessory');

const app = express();

mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

app.use('*', (req, res) =>{
    res.render('404');
});

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));