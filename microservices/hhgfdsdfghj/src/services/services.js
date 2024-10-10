
const { ObjectId } = require('mongodb');
const Hhgfdsdfghj  = require('../models/models');

const createHhgfdsdfghj = async ({ body }) => {
    const hhgfdsdfghj = await Hhgfdsdfghj.create(body);
    return { hhgfdsdfghj };
};

const getHhgfdsdfghjs = async () => {
    const hhgfdsdfghjs = await Hhgfdsdfghj.find({});
    return { hhgfdsdfghjs };
};

const getHhgfdsdfghjById = async ({ id }) => {
    const hhgfdsdfghj = await Hhgfdsdfghj.findById(id);
    return { hhgfdsdfghj };
};

const updateHhgfdsdfghjProfile = async ({ id, body }) => {
    const upserted_hhgfdsdfghj = await Hhgfdsdfghj.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_hhgfdsdfghj };
};

const deleteHhgfdsdfghj = async ({ id }) => {
    await Hhgfdsdfghj.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createHhgfdsdfghj,
    getHhgfdsdfghjs,
    getHhgfdsdfghjById,
    updateHhgfdsdfghjProfile,
    deleteHhgfdsdfghj
};
