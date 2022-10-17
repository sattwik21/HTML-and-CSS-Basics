const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");
const crypto= require("crypto");


//Register a User

exports.registerUser= catchAsyncerrors (async(req,res,next)=>{
    const{name,email,password}= req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: "this is a samile Id",
            url:"profilePicUrl",

        }
    });

    sendToken(user,201,res);
});

// Login User

exports.loginUser = catchAsyncerrors (async (req,res,next)=>{

    const {email, password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new Errorhandler("please Enter Email & password", 400))
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new Errorhandler("Invalid email or password",401));
    }
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new Errorhandler("invalid email or password",401));
    }
    sendToken(user,200,res);
})

//logout User

exports.logout= catchAsyncerrors(async (req,res,next)=>{

    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    })
});

//Forgot Password

exports.forgotPassword = catchAsyncerrors(async (req,res, next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!User){
        return next(new Errorhandler("user not found", 404));

    }

    // get reset password token

    const resetToken = user.getResetPasswordTokens();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${resetToken}`

    const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nif you have not requested this email then please
    ignore it`;
    
    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`,
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new Errorhandler(error.message, 500));
    }
    
})

//resetpassowrd
exports.resetpassword = catchAsyncerrors(async (req,res, next)=>{

    //creating token hash

    const resetPasswordToken =crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!User){
        return next(new Errorhandler("Reset password Token is invalid or has been expired", 400));

    }
    if(req.body.password !== req.body.confirmPassword){
       
         return next(new Errorhandler("password doesnot match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
    

})

// get user Details  

exports.getUserDetails = catchAsyncerrors(async (req, res, next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Passowrd

exports.updatePassowrd = catchAsyncerrors(async (req, res, next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new Errorhandler("old password is incorrect",400));
    }
    
    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new Errorhandler("passowrd doesn't exists", 400));
    }
    user.password = req.body.newPassword

    await user.save();


   sendToken(user, 200, res);
});

//update user profile

exports.updateProfile = catchAsyncerrors(async ( req,res,next)=>{

    const newUserData ={
        name: req.body.name,
        email: req.body.email,
    }
    // we will add cloudinary later
     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
         new:true,
         runValidators: true,
         useFindAndModify: false,

     });
     res.status(200).json({
         success: true
     });
});

//get all users (Admin)

exports.getAllUser = catchAsyncerrors(async (req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//get single users (Admin)

exports.getsingleUser = catchAsyncerrors(async (req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`user doesnot exists with id: ${req.params.id}`))
    }


    res.status(200).json({
        success: true,
        user,
    });
});

//update user Role - Admin

exports.updateUserRole = catchAsyncerrors(async ( req,res,next)=>{

    const newUserData ={
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
         new:true,
         runValidators: true,
         useFindAndModify: false,

     });
     res.status(200).json({
         success: true
     });
});

//Delete user -- Admin

exports.deleteUserProfile = catchAsyncerrors(async ( req,res,next)=>{

    
    // we will remove cloudinary later
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new Errorhandler(`User does not exist with id: ${req.params.id}`))
    }
    await user.remove();
     res.status(200).json({
         success: true,
         message: "user deleted Successfully."
     });
});




