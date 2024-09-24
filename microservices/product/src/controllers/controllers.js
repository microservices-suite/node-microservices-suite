
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createProduct = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { product: data } = await services.createProduct({ body });
    res.status(201).json({ data });
});

const getProducts = asyncErrorHandler(async (req, res) => {
    const { products: data } = await services.getProducts();
    res.status(200).json({ data });
});

const getProduct = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { product: data } = await services.getProductById({ id });
    if (!data) {
        throw new APIError(404, 'product not found');
    }
    res.status(200).json({ data });
});

const updateProduct = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { product } = await services.getProductById({ id });
    if (!product) {
        throw new APIError(404, 'product not found');
    }
    const { upserted_product: data } = await services.updateProductProfile({ id, body });
    res.status(200).json({ data });
});

const deleteProduct = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { product } = await services.getProductById({ id });
    if (!product) {
        throw new APIError(404, 'product not found');
    }
    await services.deleteProduct({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};

