
const mongoose = require('mongoose');

const kjhgfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Kjhgf = mongoose.model('kjhgf', kjhgfSchema);

module.exports =  Kjhgf;
