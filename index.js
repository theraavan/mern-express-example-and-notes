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


app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

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