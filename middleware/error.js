const ErrorHandler=require("../utils/errorhandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Initial Server Error";

    //wrong mongodb id error
if(err.name==="CastError"){
    const message=`resource not found. invalid :${err.path}`;
    err=new ErrorHandler(message,400);
}

if(err.code===11000){
    const messasge=`Duplicate ${Object.keys(err.keyValue)} Entered`;
    err=new ErrorHandler(message,400);
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};