const Product = require('../database/models/productModel');
const { formatMongoData, checkObjectId } = require('../helper/dbHelper');
const constants = require('../constants');
const mongoose = require('mongoose');

module.exports.createProduct = async (serviceDate) =>{
    try{
        let product = new Product({...serviceDate});
        let result =  await product.save();
        return formatMongoData(result);
    }catch(err){
        console.log('Product Service: CreateProduct: Something went wrong =>',err);
        throw new Error(err);
    }
}

module.exports.getAllProducts = async ({ skip=0, limit=10 }) =>{
    try{
        let products = await Product.find({}).skip(parseInt(skip)).limit(parseInt(limit));
        return formatMongoData(products);
    }catch(err){
        console.log('Product Service: getAllProducts: Something went wrong =>',err);
        throw new Error(err);
    }
}

module.exports.getProductById = async ({ id }) =>{
    try{
        checkObjectId(id);
        let product = await Product.findById(id);
        if(!product){
            throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
        }
        return formatMongoData(product);
    }catch(err){
        console.log('Product Service: getProductById: Something went wrong =>',err);
        throw new Error(err);
    }
}

module.exports.updateProduct = async ({ id, updateInfo }) =>{
    try{
        checkObjectId(id);
        let product = await Product.findOneAndUpdate(
            {_id: id},
            updateInfo,
            {new: true}
        );
        if(!product){
            throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
        }
        return formatMongoData(product);
    }catch(err){
        console.log('Product Service: updateProduct: Something went wrong =>',err);
        throw new Error(err);
    }
}


module.exports.deleteProduct = async ({ id }) =>{
    try{
        checkObjectId(id);
        let product = await Product.findByIdAndDelete(id);
        if(!product){
            throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
        }
        return formatMongoData(product);
    }catch(err){
        console.log('Product Service: deleteProduct: Something went wrong =>',err);
        throw new Error(err);
    }
}
