const services = require('./services')
const { catchAsync } = require('@microservices-suite/utilities')

const uploadFile = catchAsync(async (req, res) => {
    const { file } = req
    const { data } = await services.uploadFile({ file })
    res.status(200).json({ data })
})

const bulkUpload = catchAsync(async (req, res) => {
    const { files } = req.files
    const { body } = req
    const { data } = await services.bulkUpload({ files, body })
    res.status(200).json({ data})
})

const deleteFile = catchAsync(async (req, res) => {
    const { params: { public_id } } = req
    const { data } = await services.cloudinaryDeleteService({ public_id })
    res.status(200).json({ data })
})
module.exports = {
    uploadFile,
    bulkUpload,
    deleteFile
}