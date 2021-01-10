const productService = require('../service/productService');
const constants = require('../constants');



module.exports.createProduct = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.createProduct(req.body);
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_CREATED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: createProduct() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}


module.exports.getAllProducts = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.getAllProducts(req.query);
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_FETCHED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: getAllProducts() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}

module.exports.getProductById = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.getProductById(req.params);
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_FETCHED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: getProductById() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}

module.exports.updateProduct = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.updateProduct({
            id: req.params.id,
            updateInfo: req.body
        });
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_UPDATED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: updateProduct() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}

module.exports.deleteProduct = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.deleteProduct(req.params);
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_DELETED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: deleteProduct() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}


