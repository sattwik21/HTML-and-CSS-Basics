const Errorhandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";

    //wrong Mongodb Id error

    if(err.name ==="CastError"){
        const message = `Resource not found. Invaild: ${err.path}`;
        err = new Errorhandler(message,400);
    }

    //Mongoose Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new Errorhandler(message,400);

    }

     //wrong JWT error

     if(err.name ==="jsonWebTokenError"){
        const message = `Json web token is invalid, try again`;
        err = new Errorhandler(message,400);
    }

     //wrong JWT expire error

     if(err.name ==="TokenExpiredError"){
        const message = `Json web token is Expired, try again`;
        err = new Errorhandler(message,400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}