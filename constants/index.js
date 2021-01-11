module.exports = {
    defaultServerResponse:{
        status : 400,
        message : '',
        body : {}
    },
    productMessage : {
        PRODUCT_CREATED : 'Product created successfully',
        PRODUCT_FETCHED : 'Product fetched successfully',
        PRODUCT_UPDATED : 'Product updated successfully',
        PRODUCT_DELETED : 'Product deleted successfully',
        PRODUCT_NOT_FOUND : 'Product not found with given id'
    },
    userMessage:{
        SIGNUP_SUCCESS : 'Signup success',
        LOGIN_SUCCESS : 'Login successfully',
        DUPLICATE_EMAIL : 'User already exists with given email',
        USER_NOT_FOUND : 'No user found with given credentials',
        INVALID_PASSWORD : 'Incorrect password'
    },
    requestValidationMessage : {
        BAD_REQUEST : 'Invalid fields',
        TOKEN_MISSING : 'Token missing from header'
    },
    databaseMessage: {
        INVALID_ID: 'Given id is invalid please check id.'
    }
}