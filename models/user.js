const mongoose = require('mongoose');
const {Schema} = mongoose;

const User = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        match: /[a-zA-Z0-9]+/,
        minLength: 5
    },

    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', User);