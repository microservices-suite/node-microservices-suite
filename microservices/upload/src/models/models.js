
const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Upload = mongoose.model('upload', uploadSchema);

module.exports =  Upload;
