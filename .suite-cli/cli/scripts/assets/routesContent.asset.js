module.exports = ({ answers }) => `
const express = require('express');
const { validate } = require('${answers.project_base}/utilities');
const { 
    create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation, 
    get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation, 
    update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation, 
    delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation 
} = require('${answers.project_base}/validations');
const  ${answers.service_name.toLowerCase()}Controller  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/${answers.service_name.toLowerCase()}s')
    .post(validate(create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation), ${answers.service_name.toLowerCase()}Controller.create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .get(${answers.service_name.toLowerCase()}Controller.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}s);

router
    .route('/${answers.service_name.toLowerCase()}s/:id')
    .get(validate(get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation), ${answers.service_name.toLowerCase()}Controller.get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .patch(validate(update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation), ${answers.service_name.toLowerCase()}Controller.update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)})
    .delete(validate(delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Validation), ${answers.service_name.toLowerCase()}Controller.delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)});

module.exports = router;
`;
