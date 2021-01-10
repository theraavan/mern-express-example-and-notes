const Joi = require('joi');
const constants = require('../constants');

const validateObjectSchema = (data, schema) => {
    //const result = Joi.validate(data, schema);
    const result = schema.validate(data);
    console.log('Joi schema validation result', result);
    //console.log('Joi schema validation result', result.error.details);
    
    if(result.error){
        const errorDetails = result.error.details.map(value =>{
            return {
                error : value.message,
                path: value.path
            }
        });
        return errorDetails;
    }
    return null;

    //console.log('errorDetails', errorDetails);
}

module.exports.validateBody = (schema) => {
    return (req, res, next) => {
        let response = {...constants.defaultServerResponse}
        const error = validateObjectSchema(req.body, schema);
        if(error){
            response.body = error;
            response.message = constants.requestValidationMessage.BAD_REQUEST;
            return res.status(response.status).send(response);
        }
        return next();
    }
}

module.exports.validateQueryParams = (schema) => {
    return (req, res, next) => {
        let response = {...constants.defaultServerResponse}
        const error = validateObjectSchema(req.query, schema);
        if(error){
            response.body = error;
            response.message = constants.requestValidationMessage.BAD_REQUEST;
            return res.status(response.status).send(response);
        }
        return next();
    }
}