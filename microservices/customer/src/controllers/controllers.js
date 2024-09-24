
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createCustomer = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { customer: data } = await services.createCustomer({ body });
    res.status(201).json({ data });
});

const getCustomers = asyncErrorHandler(async (req, res) => {
    const { customers: data } = await services.getCustomers();
    res.status(200).json({ data });
});

const getCustomer = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { customer: data } = await services.getCustomerById({ id });
    if (!data) {
        throw new APIError(404, 'customer not found');
    }
    res.status(200).json({ data });
});

const updateCustomer = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { customer } = await services.getCustomerById({ id });
    if (!customer) {
        throw new APIError(404, 'customer not found');
    }
    const { upserted_customer: data } = await services.updateCustomerProfile({ id, body });
    res.status(200).json({ data });
});

const deleteCustomer = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { customer } = await services.getCustomerById({ id });
    if (!customer) {
        throw new APIError(404, 'customer not found');
    }
    await services.deleteCustomer({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};

