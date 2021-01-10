<h1 align="center">REST API development using express and MongoDb</h1>

<h2 align="center">

[![SOLID Architecture](#)](https://github.com/vikas-appdev)

</h2>



npm init --yes
npm i dotenv
npm i express

```js
const express = require('express');
const dotEnv = require('dotenv');

dotEnv.config()

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next)=>{
    res.send('Hello From Node Server');
})

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});
```

npm install -D nodemon

  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  
 npm run dev
 
 
 Express Middleware
 ------------------
Express is a routing and middleware web framework that has minimal functionality of 
its own: An Express application is essentially a series of middleware function calls.

Middleware functions are functions that have access to the request object (req),
the response object (res), and the next middleware function in the application’s 
request-response cycle. The next middleware function is commonly denoted by a 
variable named next.

Middleware functions can perform the following tasks:
 - Execute any code.
 - Make changes to the request and the response objects.
 - End the request-response cycle.
 - Call the next middleware function in the stack.
 
If the current middleware function does not end the request-response cycle, 
it must call next() to pass control to the next middleware function. 
Otherwise, the request will be left hanging.

An Express application can use the following types of middleware:
 - Application-level middleware
 - Router-level middleware
 - Error-handling middleware
 - Built-in middleware
 - Third-party middleware

Create a Middleware
-------------------
const appMiddleware = (req, res, next) =>{
    console.log('Hello I am a middleware');
    next();
}

Question create a middleware to print : request timestamp, method, path, status

Mount it on application
------------------------
1. Method one - Using use method of app
app.use(appMiddleware)
2. Method two - Directly on route
app.get('/', appMiddleware, (req, res, next)=>{
    res.send('Hello From Node Server');
})
3. Method three - Using path params
app.use('/', appMiddleware);

or above function can be directly written as 
app.use('/', function (req, res, next) {
  console.log(// Message)
  next()
})


Built in Middleware
------------------
- express.json : Before 4.16.0 version of express this built in middleware was not present 
in express

app.use(express.json())

- express.urlencode : Before 4.16.0 version of express this built in middleware was not present 
in express

app.use(express.urlencoded({extended: true})) // Form url-encoded data

Third party middleware
------------------------
cookie-parser
cors

What is cors?

Mongodb connectivity using mongoose
---------------------

** Install Mongodb
** SET ENVIRONMENT VARIABLE
** Create c://data/db
** run mongod on cmd
** open compass and connect with default values

Mongoose is ODM librabry.

- npm install mongoose

create a file called database/connection.js and add following code

const mongoose = require('mongoose');


module.exports = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser:true, 
			useUnifiedTopology:true
		});
        console.log('Database connected');
    }catch(err){
        console.log('Database connectivity error', err);
        throw new Error(err);
    }
}
	
Add db url inside env file : DB_URL = "mongodb://localhost/apidb"

Call above connection where you need for eg: index.js

const dbConnection = require('./database/connection');

dbConnection();


Schema Modeling
-----------------
Create a folder called model inside database folder, 
inside that folder create all model files

ProductModel.js
--------------------------

const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String
},{
    timestamps= true
})

module.exports = mongoose.model('Product', productSchema)

----------------------------------------------------------------
{
    timestamps= true
}
By supplying additional parameters we can save some additional work like maintaining 
creation time and last updated at value manually updation.
---------------------------------------------------------------



Optional tools
-----------------
- Postman
- robomongo => robo3t(GUI TOOL FOR MONGODB)


API VERSIONING, POST API AND ROUTER MIDDLEWARE
-----------------------------------------------

create a new route using app.use method inside index.js
-------------------------------------------------------

app.use('/api/v1/product');

- create a folder called routes and add all routes inside that folder

router.post('/', (req, res) =>{
    res.send('Product created successfully');
})














- Refactor the above code to follow the architecture 

- create a folder called controller
- Add productcontroller.js inside that folder and add following code

module.exports.createProduct = (req, res) =>{
    console.log('Request Body: ', req.body);
    res.send('Product created ');
}

Inside productRoute replace the post call with following code 

router.post('/', productController.createProduct);

To follow the service pattern create a folder called service and inside 
that create a file called productService.js and add following code
---------------------------------------------------------------------------------------------------------------------

module.exports.createProduct = (serviceData) =>{
    console.log(serviceData);
}

Make use of service inside controller
-----------------------------------------
Replace product controller with following code 

const productService = require('../service/productService');
module.exports.createProduct = (req, res) =>{
    productService.createProduct(req.body);
}

Save data using service and reuse it
--------------------------------------
const Product = require('../database/models/productModel');

module.exports.createProduct = async (serviceDate) =>{
    try{
        let product = new Product({...serviceDate});
        return await product.save();
    }catch(err){
        throw new Error(err);
    }
}


Refactor code once again by extracting constant and handling error properly 
inside controller, final code should look like following 

index.js
--------
const express = require('express');
const dotEnv = require('dotenv');
const dbConnection = require('./database/connection');

dotEnv.config()
const app = express();
const PORT = process.env.PORT || 3000;

// Db Connection
dbConnection();

// Built-In middleware
app.use(express.json());


app.use('/api/v1/product', require('./routes/productRoutes'));


app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});

// Error handler middleware
app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500).send({
        status: 500,
        message: err.message,
        body:{}
    })
})


database => connection.js

const mongoose = require('mongoose');


module.exports = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true});
        console.log('Database connected');
    }catch(err){
        console.log('Database connectivity error', err);
        throw new Error(err);
    }
}


database => models => productModel.js

const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String
},{
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema)


routes => productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');


//router.post('/', productController.createProduct);
router.post('/test', productController.createProduct);


module.exports = router;


controller => productController.js

const productService = require('../service/productService');
const constants = require('../constants');



module.exports.createProduct = async (req, res) =>{
    let response = {};
    //let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.createProduct(req.body);
        response.status = 200;
        response.message = 'Product created successfully';
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: createProduct() =>', err);
        response.status = 400;
        response.message = err.message;
        response.body = {};
    }
    return res.status(response.status).send(response);
}


service => productService.js

const Product = require('../database/models/productModel');

module.exports.createProduct = async (serviceDate) =>{
    try{
        let product = new Product({...serviceDate});
        return await product.save();
    }catch(err){
        throw new Error(err);
    }
}




constants => index.js

module.exports = {
    defaultServerResponse:{
        status : 400,
        message : '',
        body : {}
    },
    productMessage : {
        PRODUCT_CREATED : 'Product created successfully'
    }
}


.env 

PORT = 3002
DB_URL = "mongodb://localhost/testdb"

package.json

{
  "name": "express-starter",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "mongoose": "^5.11.9"
  },
  "devDependencies": {
    "nodemon": "^2.0.6"
  }
}



Mongoose "toObject" transform

open model and add following below timestamps

timestamps: true,
toObject : {
	transform: function(doc, ret, options){
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	}
}

inside service store the returning result into a variable and transform the result
before returning data.

let result =  await product.save();
return result.toObject();


Create product API scheme

=> npm i joi (A library to validate schema)

create a folder apiSchema inside that create a file called productSchema.js 
and add following code


const Joi = require('joi');

module.exports.createProductSchema = Joi.object().keys({
    name : Joi.string().required(),
    price : Joi.number().required(),
    brand: Joi.string().required()
});

API schema validation middleware before sending it to controller to 
reduce network time

create a folder called middleware, create a file named joiSchemaValidation.js
and add the following code 

const Joi = require('joi');

const validateObjectSchema = (data, schema) => {
    //const result = Joi.validate(data, schema);
    const result = schema.validate(data);
    console.log('Joi schema validation result', result);
}

module.exports.validateBody = (schema) => {
    return (req, res, next) => {
        validateObjectSchema(req.body, schema);
    }
}


Add middleware inside route as second param.
router.post(
	'/', 
	joiSchemaValidation.validateBody(productSchema.createProductSchema), 
	productController.createProduct
);


Extract error message from validate

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


Const

module.exports = {
    defaultServerResponse:{
        status : 400,
        message : '',
        body : {}
    },
    productMessage : {
        PRODUCT_CREATED : 'Product created successfully'
    },
    requestValidationMessage : {
        BAD_REQUEST : 'Invalid fields'
    }
}



Product List API with pagination
----------------------------------

1. open product controller and copy createProduct function and add below by renaming as 
getAllProduct

2. create a constant for product fetched like below 

productMessage : {
	PRODUCT_CREATED : 'Product created successfully',
	PRODUCT_FETCHED : 'Product fetched successfully'
},

3. Make use of above constant inside controller

4. Add newly created controller inside route

	router.get('/', productController.getAllProducts);
	
5. Create a service inside service to get all products using find function of mongoose
	on product schema.
	
	module.exports.getAllProducts = async (serviceDate) =>{
		try{
			let products = await Product.find({});
			return products;
		}catch(err){
			console.log('Product Service: getAllProducts: Something went wrong =>',err);
			throw new Error(err);
		}
	}
	
6. Refactor every layer to make use of getAllProduct 

7. Test route using http get method by hitting url in browser or inside postman 
	http://localhost:3002/api/v1/products
	
Transform fetched result 
--------------------------
* we can transform result inside for loop and return it but with that we have to write 
transformation logic every time when we fetched products anywhere else i.e is the reason
we will create a helper function to reuse this logic.

1. create a folder called helper
2. create a file dbHelper inside that folder and export a function for format
the result of mongo data that will take a argument as Array data or single data.

module.exports.formatMongoData = (data) => {
    let newDataList = [];
    if(Array.isArray(data)){
        for(value of data){
            newDataList.push(value.toObject());
        }
        return newDataList;
    }
    return data.toObject();

}

3. Make use of formatData method inside service to transform the data

import method inside service as file module

const { formatMongoData } = require('../helper/dbHelper');

now replace the return statement "return products;" with following code

return formatMongoData(products);

Make use of this function inside create product function too.

return formatMongoData(result);


Test code wether it is working or not



Get query params
------------------------
open apiSchema => productSchema.js and add following code 
module.exports.getAllProductSchema = Joi.object().keys({
    skip: Joi.string(),
    limit: Joi.string()
})

create a middleware to validate query params
copy existing validation code and replace req.body with req.parms

apply middleware on routes

router.get('/', 
joiSchemaValidation.validateQueryParams(productSchema.getAllProductSchema), 
productController.getAllProducts);


test code by passing query string 


Make use of query string for pagination

Open product controller and pass req.query inside get all product function as a param


Open service and destructure the value from object params and add skip and limit on find()


module.exports.getAllProducts = async ({ skip=0, limit=10 }) =>{
    try{
        let products = await Product.find({}).skip(parseInt(skip)).limit(parseInt(limit));
        return formatMongoData(products);
    }catch(err){
        console.log('Product Service: getAllProducts: Something went wrong =>',err);
        throw new Error(err);
    }
}

Test code by passing skip and limit params 
http://localhost:3002/api/v1/products?skip=0&limit=1


GET PRODUCT BY ID
--------------------
create a function inside controller to get product by id
copy export code and paste by remaming it getProductById and replace the service call 
with getProductById which will take a params "req.params"

create service getProductById
module.exports.getProductById = async ({ id }) =>{
    try{
        let product = await Product.findById(id);
        return formatMongoData(product);
    }catch(err){
        console.log('Product Service: getProductById: Something went wrong =>',err);
        throw new Error(err);
    }
}

Add product not found case inside service in case of wrong id 
--------------------------------------------------
define a constant for product not found message 

use constant inside service and throw message if product is null
if(!product){
	throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
}

Add route using path parameter inside routes

router.get('/:id', productController.getProductById);

Test implementation using postman by passing a correct and wrong id


Add validation on id
-----------------------
- Import mongoose inside service 
	const mongoose = require('mongoose');
- check if given id is valid object id or not
	if(!mongoose.Types.ObjectId.isValid(id)){
		throw new Error(constants.databaseMessage.INVALID_ID);
	}
- Add INVALID_ID constant inside constant file
	databaseMessage: {
        INVALID_ID: 'Given id is invalid please check id.'
    }
	
Refactor above cut validation and create a validation helper inside dbHelper
module.exports.checkObjectId = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new Error(constants.databaseMessage.INVALID_ID);
    }

}

And make use of helper function inside service


Update product By Id :
---------------------------

define a validation schema inside apiSchema
module.exports.updateProductSchema = Joi.object().keys({
    name : Joi.string(),
    price : Joi.number(),
    brand: Joi.string()
})

create a updateProduct controller
module.exports.updateProduct = async (req, res) =>{
    //let response = {};
    let response = {...constants.defaultServerResponse};
    try{
        const responseFromService = await productService.updateProduct({
            id: req.params.id,
            updateInfo: req.body
        });
        response.status = 200;
        response.message = constants.productMessage.PRODUCT_FETCHED;
        response.body = responseFromService;
    }catch(err){
        console.error('Product Controller: updateProduct() =>', err);
        response.message = err.message;
    }
    return res.status(response.status).send(response);
}

create service for updating data inside mongo
- There is two method for updating data updateOne and findOneAndUpdate updateOne 
does not return anything, we want updated data as response so will make use of 
findOneAndUpdate

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


Add route with put mapping by passing validate middleware 

router.put('/:id', joiSchemaValidation.validateBody(productSchema.updateProductSchema), productController.updateProduct);



DELETE PRODUCT BY Id:
---------------------------

create a delete product controller

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

Define a service for deleting product 

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



Add delete router 
router.delete('/:id', productController.deleteProduct);


Test by deleting a product






















