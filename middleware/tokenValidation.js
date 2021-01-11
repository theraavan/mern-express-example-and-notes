const constant = require('../constants');



module.exports.validateToken = (req, res, next) => {
    let response = {...constant.defaultServerResponse};
    try{
        if(!req.headers.authorization){
            throw new Error(constant.requestValidationMessage.TOKEN_MISSING);
        }
    }catch(error){
        console.error('Error', error);
    }
}