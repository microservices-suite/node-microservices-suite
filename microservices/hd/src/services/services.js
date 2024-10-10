
const { ObjectId } = require('mongodb');
const Hd  = require('../models/models');

const createHd = async ({ body }) => {
    const hd = await Hd.create(body);
    return { hd };
};

const getHds = async () => {
    const hds = await Hd.find({});
    return { hds };
};

const getHdById = async ({ id }) => {
    const hd = await Hd.findById(id);
    return { hd };
};

const updateHdProfile = async ({ id, body }) => {
    const upserted_hd = await Hd.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_hd };
};

const deleteHd = async ({ id }) => {
    await Hd.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createHd,
    getHds,
    getHdById,
    updateHdProfile,
    deleteHd
};
