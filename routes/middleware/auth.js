const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req,res,next)=>{

    try{
        var token = req.headers['authorization'].split(" ")[1];

        var decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userData = decode;

        next();

    }catch(err){
        res.status(403).send({
            error:"Invalid Token. Try to login again",
        });
    }
};