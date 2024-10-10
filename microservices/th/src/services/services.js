
const { ObjectId } = require('mongodb');
const Th  = require('../models/models');

const createTh = async ({ body }) => {
    const th = await Th.create(body);
    return { th };
};

const getThs = async () => {
    const ths = await Th.find({});
    return { ths };
};

const getThById = async ({ id }) => {
    const th = await Th.findById(id);
    return { th };
};

const updateThProfile = async ({ id, body }) => {
    const upserted_th = await Th.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_th };
};

const deleteTh = async ({ id }) => {
    await Th.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createTh,
    getThs,
    getThById,
    updateThProfile,
    deleteTh
};
