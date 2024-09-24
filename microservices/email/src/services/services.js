
const { ObjectId } = require('mongodb');
const Email  = require('../models/models');

const createEmail = async ({ body }) => {
    const email = await Email.create(body);
    return { email };
};

const getEmails = async () => {
    const emails = await Email.find({});
    return { emails };
};

const getEmailById = async ({ id }) => {
    const email = await Email.findById(id);
    return { email };
};

const updateEmailProfile = async ({ id, body }) => {
    const upserted_email = await Email.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_email };
};

const deleteEmail = async ({ id }) => {
    await Email.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createEmail,
    getEmails,
    getEmailById,
    updateEmailProfile,
    deleteEmail
};
