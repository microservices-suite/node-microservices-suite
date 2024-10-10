
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createGhjk = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { ghjk: data } = await services.createGhjk({ body });
    res.status(201).json({ data });
});

const getGhjks = asyncErrorHandler(async (req, res) => {
    const { ghjks: data } = await services.getGhjks();
    res.status(200).json({ data });
});

const getGhjk = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { ghjk: data } = await services.getGhjkById({ id });
    if (!data) {
        throw new APIError(404, 'ghjk not found');
    }
    res.status(200).json({ data });
});

const updateGhjk = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { ghjk } = await services.getGhjkById({ id });
    if (!ghjk) {
        throw new APIError(404, 'ghjk not found');
    }
    const { upserted_ghjk: data } = await services.updateGhjkProfile({ id, body });
    res.status(200).json({ data });
});

const deleteGhjk = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { ghjk } = await services.getGhjkById({ id });
    if (!ghjk) {
        throw new APIError(404, 'ghjk not found');
    }
    await services.deleteGhjk({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createGhjk,
    getGhjks,
    getGhjk,
    updateGhjk,
    deleteGhjk
};

