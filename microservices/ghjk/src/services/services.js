
const { ObjectId } = require('mongodb');
const Ghjk  = require('../models/models');

const createGhjk = async ({ body }) => {
    const ghjk = await Ghjk.create(body);
    return { ghjk };
};

const getGhjks = async () => {
    const ghjks = await Ghjk.find({});
    return { ghjks };
};

const getGhjkById = async ({ id }) => {
    const ghjk = await Ghjk.findById(id);
    return { ghjk };
};

const updateGhjkProfile = async ({ id, body }) => {
    const upserted_ghjk = await Ghjk.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_ghjk };
};

const deleteGhjk = async ({ id }) => {
    await Ghjk.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createGhjk,
    getGhjks,
    getGhjkById,
    updateGhjkProfile,
    deleteGhjk
};
