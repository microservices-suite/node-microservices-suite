
const { ObjectId } = require('mongodb');
const Upload  = require('../models/models');

const createUpload = async ({ body }) => {
    const upload = await Upload.create(body);
    return { upload };
};

const getUploads = async () => {
    const uploads = await Upload.find({});
    return { uploads };
};

const getUploadById = async ({ id }) => {
    const upload = await Upload.findById(id);
    return { upload };
};

const updateUploadProfile = async ({ id, body }) => {
    const upserted_upload = await Upload.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_upload };
};

const deleteUpload = async ({ id }) => {
    await Upload.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createUpload,
    getUploads,
    getUploadById,
    updateUploadProfile,
    deleteUpload
};
