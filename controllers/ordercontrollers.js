const Order=require("../models/ordermodels");
const Product=require("../models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors=require("../middleware/catchasyncerrors");

//create new order
exports.newOrder=catchasyncerrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo}=req.body;
    const order=await Order.create({shippingInfo,orderItems,paymentInfo,user:req.user._id,});

    res.status(201).json({
        success:true,
        order,
    })
})

//get single order
exports.getsingleorder=catchasyncerrors(async(req,res,next)=>{
     const order=await Order.findById(req.params.id).populate("user","name email");
     if(!order){
        return next(new ErrorHandler("order not found",404)); 
     }
    res.status(200).json({
        success:true,
        order,
    })
})

//get logged in user order
exports.myorder=catchasyncerrors(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});
   res.status(200).json({
       success:true,
       orders,
   })
})

//get all order--admin
exports.allorders=catchasyncerrors(async(req,res,next)=>{
    const orders=await Order.find();
let totalamount = 0;
orders.forEach(order=>{
    totalamount = totalamount + order.paymentInfo.TotalPrice;
})

   res.status(200).json({
       success:true,
       totalamount,
       orders,
   })
})

//update order stauts--admin
exports.updateorder=catchasyncerrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
   
    if(!order){
        return next(new ErrorHandler("order not found",404)); 
     }
     if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("delivered the order",400));

    }
   if(req.body.status==="Shipped"){
    order.orderItems.forEach(async (o) =>{
        await updateStock(o.product,o.quantity);
    });
   }
    order.paymentInfo.orderStatus=req.body.status;

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false});
   res.status(200).json({
       success:true,
   })
})

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.Stock=product.Stock-quantity;
    await product.save({validateBeforeSave:false});
}

//delete order --admin
exports.deleteorder=catchasyncerrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("order not found",404)); 
     }
     await Order.deleteOne(order);
     res.status(200).json({
        success:true,
    })
})