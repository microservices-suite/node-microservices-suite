
const { ObjectId } = require('mongodb');
const Payment  = require('../models/models');

const createPayment = async ({ body }) => {
    const payment = await Payment.create(body);
    return { payment };
};

const getPayments = async () => {
    const payments = await Payment.find({});
    return { payments };
};

const getPaymentById = async ({ id }) => {
    const payment = await Payment.findById(id);
    return { payment };
};

const updatePaymentProfile = async ({ id, body }) => {
    const upserted_payment = await Payment.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_payment };
};

const deletePayment = async ({ id }) => {
    await Payment.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    updatePaymentProfile,
    deletePayment
};
