
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createUpload = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { upload: data } = await services.createUpload({ body });
    res.status(201).json({ data });
});

const getUploads = asyncErrorHandler(async (req, res) => {
    const { uploads: data } = await services.getUploads();
    res.status(200).json({ data });
});

const getUpload = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { upload: data } = await services.getUploadById({ id });
    if (!data) {
        throw new APIError(404, 'upload not found');
    }
    res.status(200).json({ data });
});

const updateUpload = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { upload } = await services.getUploadById({ id });
    if (!upload) {
        throw new APIError(404, 'upload not found');
    }
    const { upserted_upload: data } = await services.updateUploadProfile({ id, body });
    res.status(200).json({ data });
});

const deleteUpload = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { upload } = await services.getUploadById({ id });
    if (!upload) {
        throw new APIError(404, 'upload not found');
    }
    await services.deleteUpload({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createUpload,
    getUploads,
    getUpload,
    updateUpload,
    deleteUpload
};

