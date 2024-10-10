
const { ObjectId } = require('mongodb');
const Test  = require('../models/models');

const createTest = async ({ body }) => {
    const test = await Test.create(body);
    return { test };
};

const getTests = async () => {
    const tests = await Test.find({});
    return { tests };
};

const getTestById = async ({ id }) => {
    const test = await Test.findById(id);
    return { test };
};

const updateTestProfile = async ({ id, body }) => {
    const upserted_test = await Test.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_test };
};

const deleteTest = async ({ id }) => {
    await Test.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createTest,
    getTests,
    getTestById,
    updateTestProfile,
    deleteTest
};
