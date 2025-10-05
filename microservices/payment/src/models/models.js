
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Payment = mongoose.model('payment', paymentSchema);

module.exports =  Payment;
