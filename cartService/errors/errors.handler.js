const config = require("../config/config");
const { logger } = require("../config/logger");
const { APIError } = require("../utilities/APIError");

const prodErrors = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something wrong happened! Try again later'
        });
    }
}
const devErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stack: err.stack,
        err
    });
}
const castErrorHandler = (err) => {
    err.message = `Invalid value ${err.value} for field ${err.path}`
    return new APIError(400, err.message)
}
const duplicateKeyErrorHandler = (err) => {
    const key = Object.keys(err.keyValue)[0]
    const value = err.keyValue[key]
    const message = `Entry with ${key}:${value} already exists`
    return new APIError(400, message)
}
const errorHandler = (err, req, res, next) => {
    // TODO: create the global error handler
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;
    if (config.env === 'dev') {
        devErrors(err, res);
    }
    else {
        let error = { ...err, message: err.message }
        if (err.name === 'CastError') {
            error = castErrorHandler(error)
        }
        if (err.code === 11000) {
            error = duplicateKeyErrorHandler(error)
        }
        prodErrors(error, res)
    }
}

module.exports = {
    errorHandler
}