const mongoose = require('mongoose');
const {Schema} = mongoose;

const Accessory = new Schema({

    name: {
        type: String,
        required: true
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

    cubes: [{
        type: Schema.Types.ObjectID,
        ref: 'Cube'
    }]
});

module.exports = mongoose.model('Accessory', Accessory);