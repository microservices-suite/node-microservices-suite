
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Email = mongoose.model('email', emailSchema);

module.exports =  Email;
