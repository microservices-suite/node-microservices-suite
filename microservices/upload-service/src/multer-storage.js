const { diskStorage } = require('multer');
const path = require('path');

const multerStorage = {
    storage: diskStorage({
        destination: '../../.tmp/uploads', //temporary directory for multer to hold  files in transit
        filename: (req, file, cb) => {
            const filename = `${Date.now()}${path.extname(file.originalname)}`;
            cb(null, filename);
        },
    }),
};

module.exports = { multerStorage }