const mongoose = require('mongoose');
const {Schema} = mongoose;

const Cube =  new Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,

        validate: {
            validator: function(val) {
                return val.length <= 2000;
            },
            message: 'Description should not exceed 2000 symbols!'
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