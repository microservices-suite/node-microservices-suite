module.exports = ({ answers }) => `
const mongoose = require('mongoose');

const ${answers.service_name}Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)} = mongoose.model('${answers.service_name}', ${answers.service_name}Schema);

module.exports =  ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)};
`;
