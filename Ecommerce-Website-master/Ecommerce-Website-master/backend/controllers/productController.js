const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerrors");
const Apifeatures = require("../utils/apifeatures");




//create Product -- Admin

exports.createProduct = catchAsyncerrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })
});

//Get All products
exports.getAllproducts = catchAsyncerrors(async (req, res) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeature = new Apifeatures(Product.find(), req.query)
        .search()
        .filter().pagination(resultPerPage);

    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount,
        
    });


});

//get product details
exports.getProductDetails = catchAsyncerrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
        productCount
    })

})

// Update product -- Admin

exports.updateProduct = catchAsyncerrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: "product successfully updated",
        product
    })
});

//Delete Product

exports.deleteProduct = catchAsyncerrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }

    await product.remove();
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
});

// create New Review or Update the review

exports.createProductReview = catchAsyncerrors(async ( req,res,next)=>{

    const { rating, comment, productid} = req.body;

    const review = {
        user:req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment,

    };
    const product = await Product.findById(productid);

    const isreviewed =  product.reviews.find((rev) =>rev.user.toString()===req.user._id.toString());

    if(isreviewed){
        product.reviews.forEach((rev)=>{
            if((rev) =>rev.user.toString()===req.user._id.toString())
           ( rev.rating= rating),
           ( rev.comment = comment);
        });
    } 
    else{
        product.reviews.push(review);
        product.numReviews = product.reviews.length
    }
    let avg = 0;

    product.reviews.forEach(rev=>{
        avg +=rev.rating
    })
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true,
        product
    });

});

//Get All Reviews of a product

exports.getproductREviews = catchAsyncerrors(async (req,res, next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new Errorhandler("product not found", 404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

// Delete Review

exports.deleteReviews = catchAsyncerrors(async (req,res, next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new Errorhandler("product not found", 404));


    }

    const reviews = product.reviews.filter((rev)=> rev._id.toString()!==req.query.id.toString());
    let avg = 0;

    reviews.forEach((rev)=>{
        avg +=rev.rating;
    })
    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;


    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviews
    },
    {
        new:true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
    });
});
