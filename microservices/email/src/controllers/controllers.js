
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createEmail = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { email: data } = await services.createEmail({ body });
    res.status(201).json({ data });
});

const getEmails = asyncErrorHandler(async (req, res) => {
    const { emails: data } = await services.getEmails();
    res.status(200).json({ data });
});

const getEmail = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { email: data } = await services.getEmailById({ id });
    if (!data) {
        throw new APIError(404, 'email not found');
    }
    res.status(200).json({ data });
});

const updateEmail = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { email } = await services.getEmailById({ id });
    if (!email) {
        throw new APIError(404, 'email not found');
    }
    const { upserted_email: data } = await services.updateEmailProfile({ id, body });
    res.status(200).json({ data });
});

const deleteEmail = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = await services.getEmailById({ id });
    if (!email) {
        throw new APIError(404, 'email not found');
    }
    await services.deleteEmail({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createEmail,
    getEmails,
    getEmail,
    updateEmail,
    deleteEmail
};

