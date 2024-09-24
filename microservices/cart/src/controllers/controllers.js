
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createCart = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { cart: data } = await services.createCart({ body });
    res.status(201).json({ data });
});

const getCarts = asyncErrorHandler(async (req, res) => {
    const { carts: data } = await services.getCarts();
    res.status(200).json({ data });
});

const getCart = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { cart: data } = await services.getCartById({ id });
    if (!data) {
        throw new APIError(404, 'cart not found');
    }
    res.status(200).json({ data });
});

const updateCart = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { cart } = await services.getCartById({ id });
    if (!cart) {
        throw new APIError(404, 'cart not found');
    }
    const { upserted_cart: data } = await services.updateCartProfile({ id, body });
    res.status(200).json({ data });
});

const deleteCart = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { cart } = await services.getCartById({ id });
    if (!cart) {
        throw new APIError(404, 'cart not found');
    }
    await services.deleteCart({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createCart,
    getCarts,
    getCart,
    updateCart,
    deleteCart
};

