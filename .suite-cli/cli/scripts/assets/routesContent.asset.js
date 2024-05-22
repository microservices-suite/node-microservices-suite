module.exports = ({ answers }) => `
const express = require('express');
const { validate } = require('${answers.project_base}/utilities');

const  ${answers.service_name.toLowerCase()}Controller  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/${answers.service_name.toLowerCase()}s')
    .post(${answers.service_name.toLowerCase()}Controller.create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .get(${answers.service_name.toLowerCase()}Controller.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}s);

router
    .route('/${answers.service_name.toLowerCase()}s/:id')
    .get(${answers.service_name.toLowerCase()}Controller.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .patch(${answers.service_name.toLowerCase()}Controller.update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .delete(${answers.service_name.toLowerCase()}Controller.delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)});

module.exports = router;
`;
