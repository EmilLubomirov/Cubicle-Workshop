const mongoose = require('mongoose');
const {Schema} = mongoose;

const Accessory = new Schema({

    name: {
        type: String,
        required: true,
        minLength: 5,

        validate: {
            validator: function (val) {
                return RegExp(/[a-zA-Z0-9 ]+/).test(val);
            },
            message: 'Image url should start with http:// or https://!'
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
            message: 'Description should be between 20 and 2000 symbols!'
        }
    },

    cubes: [{
        type: Schema.Types.ObjectID,
        ref: 'Cube'
    }]
});

module.exports = mongoose.model('Accessory', Accessory);