
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createKjhgf = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { kjhgf: data } = await services.createKjhgf({ body });
    res.status(201).json({ data });
});

const getKjhgfs = asyncErrorHandler(async (req, res) => {
    const { kjhgfs: data } = await services.getKjhgfs();
    res.status(200).json({ data });
});

const getKjhgf = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { kjhgf: data } = await services.getKjhgfById({ id });
    if (!data) {
        throw new APIError(404, 'kjhgf not found');
    }
    res.status(200).json({ data });
});

const updateKjhgf = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { kjhgf } = await services.getKjhgfById({ id });
    if (!kjhgf) {
        throw new APIError(404, 'kjhgf not found');
    }
    const { upserted_kjhgf: data } = await services.updateKjhgfProfile({ id, body });
    res.status(200).json({ data });
});

const deleteKjhgf = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { kjhgf } = await services.getKjhgfById({ id });
    if (!kjhgf) {
        throw new APIError(404, 'kjhgf not found');
    }
    await services.deleteKjhgf({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createKjhgf,
    getKjhgfs,
    getKjhgf,
    updateKjhgf,
    deleteKjhgf
};

