module.exports = ({ answers }) => `
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { config, morgan, logger } = require('${answers.project_base}/config');
const { errorHandler } = require('${answers.project_base}/errors');
const { validate, APIError } = require('${answers.project_base}/utilities');
const { getUsers } = require('./src/services');
const { router } = require('./src/routes');
// const app = require('./src/app');

mongoose.connect(config.db).then(() => {
logger.info(\`📀 successfully connected to db: \${config.db}\`);
}).catch(err => {
logger.error(\`failed to connect to db.exiting...\${err.message}\`);
process.exit(0);
});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
res.json({ messae: 'hello from ${answers.project_base}' });
});

const server = http.createServer(app);

server.on('error', (err) => {
logger.error(err);
if (err.code === 'EADDRINUSE') {
    logger.error('Address already in use, retrying...');
    setTimeout(() => {
    server.close();
    server.listen(config.port, 'localhost');
    }, 1000);
    errorHandler(err);
}
})

server.listen(config.port, () => {
    logger.info(\`🚀 ${answers.project_base,sep,answers.service_name} listening at: http://localhost:\${config.port}\`);
});

app.use(morgan.errorHandler);

app.use(morgan.successHandler);

app.use('/api/v1', router);

// global error handler should come after all other middlewares
app.all('*', (req, res, next) => {
const err = new APIError(404, \`requested resource not found on server: \${req.originalUrl}\`);
next(err);
});

app.use(errorHandler);
`;