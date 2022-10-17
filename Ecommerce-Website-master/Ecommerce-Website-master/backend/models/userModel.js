const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const crypto= require("crypto");


const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        minlength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minlength: [8, "Password  should have more than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
});
// JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

// compare password 

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// Gathering password Restore Token

userSchema.methods.getResetPasswordTokens = function(){

    //Generationg token

    const resetToken =crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to user Schema

    this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 *1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);