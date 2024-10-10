
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createShjksgd = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { shjksgd: data } = await services.createShjksgd({ body });
    res.status(201).json({ data });
});

const getShjksgds = asyncErrorHandler(async (req, res) => {
    const { shjksgds: data } = await services.getShjksgds();
    res.status(200).json({ data });
});

const getShjksgd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { shjksgd: data } = await services.getShjksgdById({ id });
    if (!data) {
        throw new APIError(404, 'shjksgd not found');
    }
    res.status(200).json({ data });
});

const updateShjksgd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { shjksgd } = await services.getShjksgdById({ id });
    if (!shjksgd) {
        throw new APIError(404, 'shjksgd not found');
    }
    const { upserted_shjksgd: data } = await services.updateShjksgdProfile({ id, body });
    res.status(200).json({ data });
});

const deleteShjksgd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { shjksgd } = await services.getShjksgdById({ id });
    if (!shjksgd) {
        throw new APIError(404, 'shjksgd not found');
    }
    await services.deleteShjksgd({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createShjksgd,
    getShjksgds,
    getShjksgd,
    updateShjksgd,
    deleteShjksgd
};

