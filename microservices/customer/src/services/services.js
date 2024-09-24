
const { ObjectId } = require('mongodb');
const Customer  = require('../models/models');

const createCustomer = async ({ body }) => {
    const customer = await Customer.create(body);
    return { customer };
};

const getCustomers = async () => {
    const customers = await Customer.find({});
    return { customers };
};

const getCustomerById = async ({ id }) => {
    const customer = await Customer.findById(id);
    return { customer };
};

const updateCustomerProfile = async ({ id, body }) => {
    const upserted_customer = await Customer.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_customer };
};

const deleteCustomer = async ({ id }) => {
    await Customer.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomerProfile,
    deleteCustomer
};
