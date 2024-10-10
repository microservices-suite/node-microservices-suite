
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createHd = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { hd: data } = await services.createHd({ body });
    res.status(201).json({ data });
});

const getHds = asyncErrorHandler(async (req, res) => {
    const { hds: data } = await services.getHds();
    res.status(200).json({ data });
});

const getHd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { hd: data } = await services.getHdById({ id });
    if (!data) {
        throw new APIError(404, 'hd not found');
    }
    res.status(200).json({ data });
});

const updateHd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { hd } = await services.getHdById({ id });
    if (!hd) {
        throw new APIError(404, 'hd not found');
    }
    const { upserted_hd: data } = await services.updateHdProfile({ id, body });
    res.status(200).json({ data });
});

const deleteHd = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { hd } = await services.getHdById({ id });
    if (!hd) {
        throw new APIError(404, 'hd not found');
    }
    await services.deleteHd({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createHd,
    getHds,
    getHd,
    updateHd,
    deleteHd
};

