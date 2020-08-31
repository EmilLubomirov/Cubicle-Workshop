const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const express = require('express');

const indexRouter = require('./routes');
const cubeRouter = require('./routes/cube');

const app = express();

require('./config/express')(app);

app.use('/', indexRouter);
app.use('/', cubeRouter);

app.use('*', (req, res) =>{
    res.render('404');
});

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));