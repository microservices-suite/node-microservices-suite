
const mongoose = require('mongoose');

const thSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Th = mongoose.model('th', thSchema);

module.exports =  Th;
