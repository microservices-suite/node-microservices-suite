
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createPayment = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { payment: data } = await services.createPayment({ body });
    res.status(201).json({ data });
});

const getPayments = asyncErrorHandler(async (req, res) => {
    const { payments: data } = await services.getPayments();
    res.status(200).json({ data });
});

const getPayment = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { payment: data } = await services.getPaymentById({ id });
    if (!data) {
        throw new APIError(404, 'payment not found');
    }
    res.status(200).json({ data });
});

const updatePayment = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { payment } = await services.getPaymentById({ id });
    if (!payment) {
        throw new APIError(404, 'payment not found');
    }
    const { upserted_payment: data } = await services.updatePaymentProfile({ id, body });
    res.status(200).json({ data });
});

const deletePayment = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { payment } = await services.getPaymentById({ id });
    if (!payment) {
        throw new APIError(404, 'payment not found');
    }
    await services.deletePayment({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createPayment,
    getPayments,
    getPayment,
    updatePayment,
    deletePayment
};

