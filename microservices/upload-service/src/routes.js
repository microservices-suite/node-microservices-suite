const express = require('express');
const multer = require('multer')
const controllers = require('./controllers');
const { validate } = require('@microservices-suite/utilities');
const { bulkUploadValidation, uploadValidation, deleteValidation } = require('./validations')
const { multerStorage } = require('./multer-storage')

const router = express.Router()

router
    .route('/upload-file')
    .post(validate(uploadValidation), multer(multerStorage).single('file'), controllers.uploadFile)
router
    .route('/bulk-upload')
    .post(validate(bulkUploadValidation), multer(multerStorage).fields([{ name: 'files', maxCount: 2 }, { name: 'name', maxCount: 1 }]), controllers.bulkUpload)
router
    .route('/delete-file/:public_id')
    .post(validate(deleteValidation), controllers.deleteFile)

module.exports = { router }