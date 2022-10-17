const Order = require("../models/orderModels");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerrors");

// create new order

exports.newOrder = catchAsyncerrors(async (req,res, next)=>{
    const {
        shippingInfo,
        orderItem,
        paymentinfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
        } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItem,
        paymentinfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,

    });
    res.status(201).json({
        success: true,
        order,
    });
});

// get Single Order

exports.getSingleOrder = catchAsyncerrors(async (req,res, next)=>{
    
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new Errorhandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get Logged In user Order

exports.myOrder = catchAsyncerrors(async (req,res, next)=>{
    
    const order = await Order.find({user:req.user._id})
    
    res.status(200).json({
        success: true,
        order,
    });
});

// get All Orders--Admin

exports.getAllOrders = catchAsyncerrors(async (req,res, next)=>{
    
    const orders = await Order.find().populate("user","name email");

    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount += order.totalPrice;
    });
    
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// Update Order Status -- Admin

exports.updateOrder = catchAsyncerrors(async (req,res, next)=>{
    
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new Errorhandler("Order not found with this Id",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new Errorhandler("you have already delivered this order", 400))
    }

    order.orderItem.forEach( async (order)=>{
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;
    
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});



    
    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave: false});
}

// delete Order--Admin

exports.deleteOrder = catchAsyncerrors(async (req,res, next)=>{
    
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new Errorhandler("Order not found with this Id",404));
    }

    await order.remove();
    
    res.status(200).json({
        success: true,
    });
});

