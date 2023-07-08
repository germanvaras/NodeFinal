const handlerValidationErrors = (err, res) => {
    const bodyError = JSON.parse(err.message);
    return res.status(400).send({ code: 400, ...bodyError });
};
const handlerDuplicateDocumentsError = (err, res) => {
    res.status(400).send({
        status: "error",
        payload: err.message,
        code: 400,
    });
};
const handlerInvalidDocumentNameError = (err, res) => {
    res.status(400).send({
        status: "error",
        payload: err.message,
        code: 400
    });
};
const handlerCredentialError = (err, res) => {
    res.status(403).send({
        status: "error",
        payload: err.message,
        code: 403
    });
};
const handlerNotFoundError = (err, res) => {
    res.status(404).send({
        status: "error",
        payload: err.message,
        code: 404
    });
};
const handlerMissingDocuments = (err, res) => {
    res.status(400).send({
        status: "error",
        payload: err.message,
        code: 400,
    });
};

const handlerEmptyFieldsError = (err, res) => {
    res.status(422).send({
        status: "error",
        payload: JSON.parse(err.message),
        code: 422
    });
};
const handlerUnauthorized = (err, res) => {
    console.log('Entró al error Unauthorized');
    res.status(401).send({
        status: "error",
        payload: err.message,
        code: 401
    });
};
const errorHandler = (err, req, res, next) => {
    try {
        if (err.message == "Contraseña Incorrecta") {
            req.logger.error(err);
            return handlerCredentialError(err, res);
        }
        if (err.message == "Usuario Inexistente") {
            req.logger.error(err);
            return handlerNotFoundError(err, res);
        }
        if (err.message.includes("requerido")) {
            req.logger.error(err);
            return handlerEmptyFieldsError(err, res);
        }
        if (err.message == "No posee la autorización para realizar esta acción") {
            req.logger.error(err);
            return handlerUnauthorized(err, res);
        }
        if (err.message.includes("Documentos existentes") || err.message.includes("Documento existente")) {
            req.logger.error(err);
            return handlerDuplicateDocumentsError(err, res);
        }
        if (err.message.includes("Nombres de documentos no válidos") || err.message.includes("Nombre de documento no válido")) {
            req.logger.error(err);
            return handlerInvalidDocumentNameError(err, res);
        }
        if (err.message.startsWith("Falta")) {
            req.logger.error(err);
            return handlerMissingDocuments(err, res);
        }

        return handlerValidationErrors(err, res);
    } catch (error) {
        req.logger.fatal(error.message);
        res.status(500).send({ status: "error", payload: "Error Interno del Servidor", code: 500 });
    }
};

module.exports = errorHandler;