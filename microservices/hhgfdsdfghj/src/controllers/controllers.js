
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createHhgfdsdfghj = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { hhgfdsdfghj: data } = await services.createHhgfdsdfghj({ body });
    res.status(201).json({ data });
});

const getHhgfdsdfghjs = asyncErrorHandler(async (req, res) => {
    const { hhgfdsdfghjs: data } = await services.getHhgfdsdfghjs();
    res.status(200).json({ data });
});

const getHhgfdsdfghj = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { hhgfdsdfghj: data } = await services.getHhgfdsdfghjById({ id });
    if (!data) {
        throw new APIError(404, 'hhgfdsdfghj not found');
    }
    res.status(200).json({ data });
});

const updateHhgfdsdfghj = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { hhgfdsdfghj } = await services.getHhgfdsdfghjById({ id });
    if (!hhgfdsdfghj) {
        throw new APIError(404, 'hhgfdsdfghj not found');
    }
    const { upserted_hhgfdsdfghj: data } = await services.updateHhgfdsdfghjProfile({ id, body });
    res.status(200).json({ data });
});

const deleteHhgfdsdfghj = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { hhgfdsdfghj } = await services.getHhgfdsdfghjById({ id });
    if (!hhgfdsdfghj) {
        throw new APIError(404, 'hhgfdsdfghj not found');
    }
    await services.deleteHhgfdsdfghj({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createHhgfdsdfghj,
    getHhgfdsdfghjs,
    getHhgfdsdfghj,
    updateHhgfdsdfghj,
    deleteHhgfdsdfghj
};

