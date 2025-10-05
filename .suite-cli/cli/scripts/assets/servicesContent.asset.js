module.exports = ({ answers }) => `
const { ObjectId } = require('mongodb');
const ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}  = require('../models/models');

const create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)} = async ({ body }) => {
    const ${answers.service_name.toLowerCase()} = await ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}.create(body);
    return { ${answers.service_name.toLowerCase()} };
};

const get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}s = async () => {
    const ${answers.service_name.toLowerCase()}s = await ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}.find({});
    return { ${answers.service_name.toLowerCase()}s };
};

const get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}ById = async ({ id }) => {
    const ${answers.service_name.toLowerCase()} = await ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}.findById(id);
    return { ${answers.service_name.toLowerCase()} };
};

const update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Profile = async ({ id, body }) => {
    const upserted_${answers.service_name.toLowerCase()} = await ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_${answers.service_name.toLowerCase()} };
};

const delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)} = async ({ id }) => {
    await ${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    create${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)},
    get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}s,
    get${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}ById,
    update${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}Profile,
    delete${answers.service_name.charAt(0).toUpperCase() + answers.service_name.slice(1)}
};
`;
