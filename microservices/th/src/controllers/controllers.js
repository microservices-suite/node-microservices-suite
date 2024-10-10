
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createTh = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { th: data } = await services.createTh({ body });
    res.status(201).json({ data });
});

const getThs = asyncErrorHandler(async (req, res) => {
    const { ths: data } = await services.getThs();
    res.status(200).json({ data });
});

const getTh = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { th: data } = await services.getThById({ id });
    if (!data) {
        throw new APIError(404, 'th not found');
    }
    res.status(200).json({ data });
});

const updateTh = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { th } = await services.getThById({ id });
    if (!th) {
        throw new APIError(404, 'th not found');
    }
    const { upserted_th: data } = await services.updateThProfile({ id, body });
    res.status(200).json({ data });
});

const deleteTh = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { th } = await services.getThById({ id });
    if (!th) {
        throw new APIError(404, 'th not found');
    }
    await services.deleteTh({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createTh,
    getThs,
    getTh,
    updateTh,
    deleteTh
};

