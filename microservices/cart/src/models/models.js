
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Cart = mongoose.model('cart', cartSchema);

module.exports =  Cart;
