class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 422;
    }
}
class NotFoundProductError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundProductError';
        this.statusCode = 404;
    }
}
class NotFoundUserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundUserError';
        this.statusCode = 404;
    }
}
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
class DuplicatedDocumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicatedDocumentError';
        this.statusCode = 400;
    }
}
class InvalidDocumentNameError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDocumentNameError';
        this.statusCode = 400;
    }
}
class MissingDocumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingDocumentError';
        this.statusCode = 400;
    }
}
class BadOwnerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadOwnerError';
        this.statusCode = 400;
    }
}
class InvalidAdminRoleError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidAdminRoleError';
        this.statusCode = 401;
    }
}
class InvalidStockPriceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidStockPriceError';
        this.statusCode = 400;
    }
}
class CredentialError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CredentialError';
        this.statusCode = 403;
    }
}
const errorHandlers = [
    { check: (err) => err instanceof ValidationError, statusCode: 422 },
    { check: (err) => err instanceof NotFoundUserError, statusCode: 404 },
    { check: (err) => err instanceof NotFoundProductError, statusCode: 404 },
    { check: (err) => err instanceof UnauthorizedError, statusCode: 401 },
    { check: (err) => err instanceof DuplicatedDocumentError, statusCode: 400 },
    { check: (err) => err instanceof InvalidDocumentNameError, statusCode: 400 },
    { check: (err) => err instanceof MissingDocumentError, statusCode: 400 },
    { check: (err) => err instanceof BadOwnerError, statusCode: 400 },
    { check: (err) => err instanceof InvalidAdminRoleError, statusCode: 401 },
    { check: (err) => err instanceof InvalidStockPriceError, statusCode: 400 },
    { check: (err) => err instanceof CredentialError, statusCode: 403 },
];
const errorHandler = (err, req, res, next) => {
    for (const { check, statusCode } of errorHandlers) {
        if (check(err)) {
            req.logger.error(err);
            if (err instanceof NotFoundProductError) {
                return res.status(404).render('404', { title: "Página no encontrada", url: req.url, user:req?.session?.user, payload:"productNotFound", style:"index.css"  });
            } else {
                return res.status(statusCode).send({
                    status: "error",
                    payload: err.message,
                    code: statusCode
                });
            }
        }
    }
    req.logger.error(err);
    return res.status(500).send({
        status: "error",
        payload: "Error Interno del Servidor",
        code: 500
    });
};
module.exports = {errorHandler, ValidationError, NotFoundUserError,NotFoundProductError, UnauthorizedError, DuplicatedDocumentError, 
    InvalidDocumentNameError, MissingDocumentError, BadOwnerError,
    InvalidAdminRoleError,InvalidStockPriceError,CredentialError };