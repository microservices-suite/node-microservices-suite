
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Supplier = mongoose.model('supplier', supplierSchema);

module.exports =  Supplier;
