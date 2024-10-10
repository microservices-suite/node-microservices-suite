
const { ObjectId } = require('mongodb');
const Kjhgf  = require('../models/models');

const createKjhgf = async ({ body }) => {
    const kjhgf = await Kjhgf.create(body);
    return { kjhgf };
};

const getKjhgfs = async () => {
    const kjhgfs = await Kjhgf.find({});
    return { kjhgfs };
};

const getKjhgfById = async ({ id }) => {
    const kjhgf = await Kjhgf.findById(id);
    return { kjhgf };
};

const updateKjhgfProfile = async ({ id, body }) => {
    const upserted_kjhgf = await Kjhgf.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_kjhgf };
};

const deleteKjhgf = async ({ id }) => {
    await Kjhgf.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createKjhgf,
    getKjhgfs,
    getKjhgfById,
    updateKjhgfProfile,
    deleteKjhgf
};
