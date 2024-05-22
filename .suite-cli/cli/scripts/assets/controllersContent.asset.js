module.exports = ({ answers }) => `
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('${answers.project_base}/utilities');

const create${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)} = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { ${answers.service_name.toLowerCase()}: data } = await services.create${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}({ body });
    res.status(201).json({ data });
});

const get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}s = asyncErrorHandler(async (req, res) => {
    const { ${answers.service_name.toLowerCase()}s: data } = await services.get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}s();
    res.status(200).json({ data });
});

const get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)} = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { ${answers.service_name.toLowerCase()}: data } = await services.get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}ById({ id });
    if (!data) {
        throw new APIError(404, '${answers.service_name.toLowerCase()} not found');
    }
    res.status(200).json({ data });
});

const update${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)} = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { ${answers.service_name.toLowerCase()} } = await services.get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}ById({ id });
    if (!${answers.service_name.toLowerCase()}) {
        throw new APIError(404, '${answers.service_name.toLowerCase()} not found');
    }
    const { upserted_${answers.service_name.toLowerCase()}: data } = await services.update${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}Profile({ id, body });
    res.status(200).json({ data });
});

const delete${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)} = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { ${answers.service_name.toLowerCase()} } = await services.get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}ById({ id });
    if (!${answers.service_name.toLowerCase()}) {
        throw new APIError(404, '${answers.service_name.toLowerCase()} not found');
    }
    await services.delete${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    create${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)},
    get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}s,
    get${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)},
    update${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)},
    delete${answers.service_name.charAt(0).toUpperCase()+answers.service_name.slice(1)}
};

`;
