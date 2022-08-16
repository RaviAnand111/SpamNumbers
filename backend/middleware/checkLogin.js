const jwt = require("jsonwebtoken")
const RegisteredUser = require("../models/registeredUserModel");

const checkLogin = async (req, res, next) => {
    try{

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        next()
    }catch(error){
        res.status(500).send({error})
    }
}

module.exports = checkLogin