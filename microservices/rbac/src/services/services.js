
const { ObjectId } = require('mongodb');
const Rbac  = require('../models/models');

const createRbac = async ({ body }) => {
    const rbac = await Rbac.create(body);
    return { rbac };
};

const getRbacs = async () => {
    const rbacs = await Rbac.find({});
    return { rbacs };
};

const getRbacById = async ({ id }) => {
    const rbac = await Rbac.findById(id);
    return { rbac };
};

const updateRbacProfile = async ({ id, body }) => {
    const upserted_rbac = await Rbac.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_rbac };
};

const deleteRbac = async ({ id }) => {
    await Rbac.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createRbac,
    getRbacs,
    getRbacById,
    updateRbacProfile,
    deleteRbac
};
