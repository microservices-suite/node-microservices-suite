
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Test = mongoose.model('test', testSchema);

module.exports =  Test;
