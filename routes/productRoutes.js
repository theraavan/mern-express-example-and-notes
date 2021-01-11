const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const joiSchemaValidation = require('../middleware/joiSchemaValidation');
const productSchema = require('../apiScheme/productScheme');
const tokenValidation = require('../middleware/tokenValidation');


//router.post('/', productController.createProduct);
router.post(
    '/', 
    joiSchemaValidation.validateBody(productSchema.createProductSchema), 
    productController.createProduct
);

router.get('/', tokenValidation.validateToken, joiSchemaValidation.validateQueryParams(productSchema.getAllProductSchema), productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.put('/:id', joiSchemaValidation.validateBody(productSchema.updateProductSchema), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);




module.exports = router;