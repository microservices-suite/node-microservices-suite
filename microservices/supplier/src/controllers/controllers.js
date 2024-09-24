
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createSupplier = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { supplier: data } = await services.createSupplier({ body });
    res.status(201).json({ data });
});

const getSuppliers = asyncErrorHandler(async (req, res) => {
    const { suppliers: data } = await services.getSuppliers();
    res.status(200).json({ data });
});

const getSupplier = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { supplier: data } = await services.getSupplierById({ id });
    if (!data) {
        throw new APIError(404, 'supplier not found');
    }
    res.status(200).json({ data });
});

const updateSupplier = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { supplier } = await services.getSupplierById({ id });
    if (!supplier) {
        throw new APIError(404, 'supplier not found');
    }
    const { upserted_supplier: data } = await services.updateSupplierProfile({ id, body });
    res.status(200).json({ data });
});

const deleteSupplier = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { supplier } = await services.getSupplierById({ id });
    if (!supplier) {
        throw new APIError(404, 'supplier not found');
    }
    await services.deleteSupplier({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier
};

