
const { ObjectId } = require('mongodb');
const Shjksgd  = require('../models/models');

const createShjksgd = async ({ body }) => {
    const shjksgd = await Shjksgd.create(body);
    return { shjksgd };
};

const getShjksgds = async () => {
    const shjksgds = await Shjksgd.find({});
    return { shjksgds };
};

const getShjksgdById = async ({ id }) => {
    const shjksgd = await Shjksgd.findById(id);
    return { shjksgd };
};

const updateShjksgdProfile = async ({ id, body }) => {
    const upserted_shjksgd = await Shjksgd.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_shjksgd };
};

const deleteShjksgd = async ({ id }) => {
    await Shjksgd.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createShjksgd,
    getShjksgds,
    getShjksgdById,
    updateShjksgdProfile,
    deleteShjksgd
};
