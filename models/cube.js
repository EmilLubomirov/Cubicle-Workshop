const mongoose = require('mongoose');
const {Schema} = mongoose;

const Cube =  new Schema({

    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,

        validate: {
            validator: function (val) {
                return RegExp(/[a-zA-Z0-9 ]+/).test(val);
            },

            message: 'Name should be between 5 and 50 symbols and ' +
                     'should consist of English letters, digits or whitespaces'
        }
    },

    description: {
        type: String,
        required: true,

        validate: {
            validator: function(val) {
                const length = val.length;

                if (length < 20 || length > 2000){
                    return false;
                }

                return RegExp(/[a-zA-Z0-9 ]+/).test(val);
            },
            message: 'Description should be between 20 and 2000 symbols and ' +
                'should consist of English letters, digits or whitespaces'
        }
    },

    imageUrl: {
        type: String,
        required: true,

        validate: {
            validator: function (val) {
                return val.startsWith('http://') || val.startsWith('https://');
            },
            message: 'Image url should start with http:// or https://!'
        }
    },

    difficulty: {
        type: Number,
        required: true,

        validate: {
            validator: function (val) {
                return val >= 1 && val <= 6;
            },
            message: 'Difficulty should be between 1 and 6!'
        }
    },

    accessories: [{
        type: Schema.Types.ObjectID,
        ref: 'Accessory'
    }],

    creatorId: {
        type: Schema.Types.ObjectID,
        ref: 'User'
    }
});

module.exports = mongoose.model('Cube', Cube);