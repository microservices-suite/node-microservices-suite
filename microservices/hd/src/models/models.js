
const mongoose = require('mongoose');

const hdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Hd = mongoose.model('hd', hdSchema);

module.exports =  Hd;
