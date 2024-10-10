
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createTest = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { test: data } = await services.createTest({ body });
    res.status(201).json({ data });
});

const getTests = asyncErrorHandler(async (req, res) => {
    const { tests: data } = await services.getTests();
    res.status(200).json({ data });
});

const getTest = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { test: data } = await services.getTestById({ id });
    if (!data) {
        throw new APIError(404, 'test not found');
    }
    res.status(200).json({ data });
});

const updateTest = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { test } = await services.getTestById({ id });
    if (!test) {
        throw new APIError(404, 'test not found');
    }
    const { upserted_test: data } = await services.updateTestProfile({ id, body });
    res.status(200).json({ data });
});

const deleteTest = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { test } = await services.getTestById({ id });
    if (!test) {
        throw new APIError(404, 'test not found');
    }
    await services.deleteTest({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createTest,
    getTests,
    getTest,
    updateTest,
    deleteTest
};

