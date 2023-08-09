const orderModel = require("../../models/order")
const orderItemModel = require('../../models/orderItem');
const userModel = require("../../models/userschema");
const couponModel = require("../../models/coupon");

const loadorder = async (req, res)=>{
    
    const orders = await orderModel.find().sort({order_date: -1});
    
    const users = await orderModel.find().populate("user").sort({order_date: -1});


    console.log(orders);
    res.render('admin/order',{orders,users});
}


const loadOrderDetails = async (req, res)=>{

    const {
        userId,
        orderId,
    } = req.query;
    
    const user = await userModel.findOne({_id: userId});
    const order = await orderModel.findOne({_id: orderId});
    const cartAddress = await orderModel.findOne({_id: orderId}).populate("address");
    const coupon = await couponModel.findOne({_id: order.coupon});
    let products = [];
    for(const item of order.items){
        const product = await orderItemModel.findOne({_id: item}).populate("product")
        products.push(product)
    }
    
    console.log(products);

    res.render('admin/orderDetails',{user, order, address: cartAddress.address, products,coupon});
}


const statusChange = async (req, res)=>{
    const {
        id,
        status
    } = req.body;
    if(status === "delivered"){
        await orderModel.findByIdAndUpdate(id,{order_status: status, payment_status: true});

    }else{
        await orderModel.findByIdAndUpdate(id,{order_status: status});        
    }

    const order = await orderModel.findOne({_id: id});

    res.json({data: order})
}



module.exports = {
    loadorder,
    loadOrderDetails,
    statusChange,
}