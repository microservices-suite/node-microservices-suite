module.exports = () => `
class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 500 ? 'fail' : 'error';

        // use this to optionally to send error message to client
        this.isOperational = true

        // preserve stack trace from base class
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = APIError
`;