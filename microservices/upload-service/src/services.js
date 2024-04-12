const { logger } = require('@microservices-suite/config')
const cloudinary = require('cloudinary')
const fs = require('fs')
// TODO: find a better way to handle env maybe move back the configs to service
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadFile = async ({ file }) => {
    logger.info(file);
    const { url } = await cloudinaryUploadService(file.path, {
        public_id: 'userId',
        folder: 'generic',
    });
    return { data: { message: 'upload successful', url } };
};

const bulkUpload = async ({ files, body }) => {
    console.log({ body, files })
    const uploads = await Promise.all(files.map(async (file) => {
        const { url } = await cloudinaryUploadService(file.path, {
            folder: 'userId',
            public_id: 'userId',
        });
        return { url, publicId: file.fieldname };

    }))
    return { data: uploads }
}

const cloudinaryUploadService = async (filePath, options) => {
    logger.info('Uploading file to Cloudinary...');
    const uploadResponse = await cloudinary.v2.uploader.upload(filePath, {
        public_id: options.public_id,
        use_asset_folder_as_public_id_prefix: true,
        folder: options.folder,
    });
    const { secure_url: url } = uploadResponse;
    logger.info('File uploaded successfully.');
    // Delete the file from the local disk
    await deleteFileFromDisk(filePath);
    return { url };

}

const cloudinaryDeleteService = async ({ public_id }) => {
    const response = await cloudinary.v2.uploader.destroy(public_id);
    logger.info('Cloudinary destroy response:');
    return { data: response };
}

const deleteFileFromDisk = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (error) => {
            if (error) {
                logger.info('Error wiping file on disk:', error.message);
                reject(error);
            } else {
                logger.info('File wiped from disk successfully.');
                resolve();
            }
        });
    });
}


module.exports = {
    uploadFile,
    bulkUpload,
    cloudinaryDeleteService
}