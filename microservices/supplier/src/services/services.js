
const { ObjectId } = require('mongodb');
const Supplier  = require('../models/models');

const createSupplier = async ({ body }) => {
    const supplier = await Supplier.create(body);
    return { supplier };
};

const getSuppliers = async () => {
    const suppliers = await Supplier.find({});
    return { suppliers };
};

const getSupplierById = async ({ id }) => {
    const supplier = await Supplier.findById(id);
    return { supplier };
};

const updateSupplierProfile = async ({ id, body }) => {
    const upserted_supplier = await Supplier.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_supplier };
};

const deleteSupplier = async ({ id }) => {
    await Supplier.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplierProfile,
    deleteSupplier
};
