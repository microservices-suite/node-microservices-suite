
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createRbac = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { rbac: data } = await services.createRbac({ body });
    res.status(201).json({ data });
});

const getRbacs = asyncErrorHandler(async (req, res) => {
    const { rbacs: data } = await services.getRbacs();
    res.status(200).json({ data });
});

const getRbac = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { rbac: data } = await services.getRbacById({ id });
    if (!data) {
        throw new APIError(404, 'rbac not found');
    }
    res.status(200).json({ data });
});

const updateRbac = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { rbac } = await services.getRbacById({ id });
    if (!rbac) {
        throw new APIError(404, 'rbac not found');
    }
    const { upserted_rbac: data } = await services.updateRbacProfile({ id, body });
    res.status(200).json({ data });
});

const deleteRbac = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { rbac } = await services.getRbacById({ id });
    if (!rbac) {
        throw new APIError(404, 'rbac not found');
    }
    await services.deleteRbac({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createRbac,
    getRbacs,
    getRbac,
    updateRbac,
    deleteRbac
};

