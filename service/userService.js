const User = require('../database/models/userModel')
const constants = require('../constants')
const bcrypt = require('bcrypt');
const { formatMongoData } = require('../helper/dbHelper');
const jwt = require('jsonwebtoken');


module.exports.signup = async ({ email, password }) => {
    try{
        const user = await User.findOne({ email }); // using es6 shortcut we can skip value if key value name is same
        // If user already exist with given email throw error else signup
        if(user){
            throw new Error(constants.userMessage.DUPLICATE_EMAIL);
        }
        // before storing it to db encrypt pass using saltRound you can give any number recommended 8 to 15
        password = await bcrypt.hash(password, 12);

        // store data with updated password
        // const newUser = new User({email:email, password:password});
        const newUser = new User({email, password}); // using es6 shortcut we can skip value if key value name is same

        let result = await newUser.save();

        // return formatted data 
        return formatMongoData(result);

    }catch(err){
        console.log('User Service: Signup: Something went wrong =>',err);
        throw new Error(err);
    }
}


module.exports.login = async ({ email, password }) => {
    try{
        const user = await User.findOne({ email }); // using es6 shortcut we can skip value if key value name is same
        // If user not exist with given email throw error
        if(!user){
            throw new Error(constants.userMessage.USER_NOT_FOUND); // Define this
        }

        // Validate password using bcrypt method using 
        const isValid = await bcrypt.compare(password, user.password);

        // if password is not valid throw error
        if(!isValid){
            throw new Error(constants.userMessage.INVALID_PASSWORD); // Define this
        }

        const token = jwt.sign({id:user._id }, process.env.SECRET_KEY || 'my-secret-key', {expiresIn: '1d'});
        

        return {token: token};// can be written as {token}

    }catch(err){
        console.log('User Service: login: Something went wrong =>',err);
        throw new Error(err);
    }
}