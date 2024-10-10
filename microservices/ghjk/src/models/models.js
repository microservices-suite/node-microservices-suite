
const mongoose = require('mongoose');

const ghjkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Ghjk = mongoose.model('ghjk', ghjkSchema);

module.exports =  Ghjk;
