const constants = require('../constants');
const userService = require('../service/userService');


module.exports.signup = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await userService.signup(req.body);
        response.status = 200;
        response.message = constants.userMessage.SIGNUP_SUCCESS;
        response.body = responseFromService;
    }catch(err){
        console.error('User Controller: signup() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}

module.exports.login = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await userService.login(req.body); // we will create this service next
        response.status = 200;
        response.message = constants.userMessage.LOGIN_SUCCESS; // add constant 
        response.body = responseFromService;
    }catch(err){
        console.error('User Controller: login() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}