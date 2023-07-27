const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors=require("../middleware/catchasyncerrors");
const User=require("../models/usermodels");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const cloudinary=require("cloudinary");


//register user
exports.registerUser=catchasyncerrors(async(req,res,next)=>{
   const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale",
   })
    const {name,email,password,phoneno,regno,role}=req.body;
    const user=await User.create({
        name,email,password,regno,phoneno,role,avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });
    sendToken(user,201,res);
})

//login user
exports.loginUser=catchasyncerrors(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler("please enter email and password",400));

    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("invalid email or password",400));

    }
    const isPasswordMatched= await user.comparePassword(password,user.password);
    if(!isPasswordMatched){
    return next(new ErrorHandler("invalid email or password",401));
    }
    sendToken(user,200,res);
})

//logout user
exports.logout = catchasyncerrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,

    })
    res.status(200).json({
        success:true,
        message:"Loggedout",
    })
})

//forgot password
exports.forgotpassword=catchasyncerrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));

    }
    //get reset password token
    const resettoken= user.getResetPasswordToken();
   await user.save({validateBeforeSave:false});
    const resetpasswordurl=`${process.env.FRONTEND_URL}/api/v1/password/reset/${resettoken}`;
    const message=`your password reset token is t:-\n\n${resetpasswordurl}\n\n if you have not requested this email then please ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:"Ecommerce Password recovery",
            message,
        })
        res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));

    }


})

//reset password
exports.resetPasswords=catchasyncerrors(async(req,res,next)=>{
    
    //creating token hash
    console.log(`${req.params.token}`);
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(`${resetPasswordToken}`);

    const user=await User.findOne({resetPasswordToken:resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},
});
if(!user){
    return next(new ErrorHandler("reset password token is invalid or has expired",404));

}
if(req.body.password!==req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match password",400));

}
user.password=req.body.password;
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;

await user.save();
sendToken(user,200,res);


})


//get user details

exports.getuserdetails=catchasyncerrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//update user password

exports.updatepass=catchasyncerrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");
    const isPasswordMatched= await user.comparePassword(req.body.oldpassword,user.password);
    if(!isPasswordMatched){
    return next(new ErrorHandler("old password is incorrect",401));
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }
    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
});

//update user profile

exports.updateprofile=catchasyncerrors(async(req,res,next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
        phoneno:req.body.phoneno,
    }

if(req.body.avatar !== ""){
    const user=await User.findById(req.user.id);
    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    })
    newUserdata.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
    }
}

    const user=await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
});

//get all users(admin)
exports.getallusers=catchasyncerrors(async(req,res,next)=>{
     const users=await User.find();
    res.status(200).json({
        success:true,
        users
    });
});

//get single user details(admin)
exports.getsingleuser=catchasyncerrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`));
    }
   res.status(200).json({
       success:true,
       user
   });
});
//update user role-admin

exports.updaterole=catchasyncerrors(async(req,res,next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
});
//delete user-admin

exports.deleteuser=catchasyncerrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`));
    }

    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"User deleted successfully",

    });
});