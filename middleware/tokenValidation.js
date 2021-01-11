const constant = require('../constants');
const jwt = require('jsonwebtoken');


module.exports.validateToken = (req, res, next) => {
    let response = {...constant.defaultServerResponse};
    try{
        if(!req.headers.authorization){
            throw new Error(constant.requestValidationMessage.TOKEN_MISSING);
        }
        console.log(req.headers.authorization.split('Bearer')[1].trim())
        const token = req.headers.authorization.split('Bearer')[1].trim();
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'my-secret-key');
        return next();
    }catch(error){
        console.error('Error', error);
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}