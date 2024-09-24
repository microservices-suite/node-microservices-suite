
const { ObjectId } = require('mongodb');
const Cart  = require('../models/models');

const createCart = async ({ body }) => {
    const cart = await Cart.create(body);
    return { cart };
};

const getCarts = async () => {
    const carts = await Cart.find({});
    return { carts };
};

const getCartById = async ({ id }) => {
    const cart = await Cart.findById(id);
    return { cart };
};

const updateCartProfile = async ({ id, body }) => {
    const upserted_cart = await Cart.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_cart };
};

const deleteCart = async ({ id }) => {
    await Cart.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createCart,
    getCarts,
    getCartById,
    updateCartProfile,
    deleteCart
};
