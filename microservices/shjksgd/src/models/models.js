
const mongoose = require('mongoose');

const shjksgdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Shjksgd = mongoose.model('shjksgd', shjksgdSchema);

module.exports =  Shjksgd;
