
const mongoose = require('mongoose');

const hhgfdsdfghjSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Hhgfdsdfghj = mongoose.model('hhgfdsdfghj', hhgfdsdfghjSchema);

module.exports =  Hhgfdsdfghj;
