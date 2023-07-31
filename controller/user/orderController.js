require('dotenv').config()
const addressModel = require("../../models/adress");
const Category = require('../../models/category');
const userModel = require("../../models/userschema");
const cartModel = require("../../models/cartSchema");
const orderModel = require("../../models/order");
const orderItemModel = require("../../models/orderItem");
const productModel = require("../../models/product");
const couponModel=require("../../models/coupon")
const Razorpay=require('razorpay');



const razorpayInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
  });
  





const loadCheckoutAddress = async (req, res)=>{
    const id = req.session.user_id;
    const category = await Category.find();
    const userId=id
    const user = await userModel.findOne({ _id: userId });
    const userData = await userModel.findOne({_id: id});
    const address = await addressModel.find({_id: id});
    const contactAddress = await addressModel.findOne({user: id,type: "contact"});
    const mainAddress = await addressModel.findOne({user: id,type: "main"});
    const secondaryAddress = await addressModel.find({user: id,type: "secondary"});

    res.render('user/checkoutAddress',{id, user: userData, contact: contactAddress, main: mainAddress, secondary: secondaryAddress, address,userId,user,category});
}


const checkoutAddAddress = async (req, res)=>{

    try {

        const user_id = req.session.user_id;

        const { 
            building,
            street,
            city,
            state,
            country,
            type
        } = req.body;

        const pincode = Number(req.body.pincode);
        const phonenumber = Number(req.body.phone);

        const newAddress = new addressModel({
            buildingName: building,
            street,
            city,
            state,
            zipCode:pincode,
            country,
            phoneNumber: phonenumber,
            user: user_id,
            type,
        })

        await newAddress.save();
        res.redirect('/checkout/address');

        
    } catch (error) {
        console.log(error);
    }
    
}

const selectAddress = async (req, res)=>{
    const {addressId ,userId} = req.query;
    const shippingAdress= await addressModel.findById({_id:addressId})
    const userData=  await userModel.findOne({_id:userId});
    
    if(userId){
        const cart = await cartModel.findOne({userId});
        let productList = [];
        const product = await cartModel
                                .findOne({userId: userId})
                                .populate("items.productId");

        product.items.forEach((item)=>{
            productList.push(item.productId)
        })

        res.render('user/checkout',{cart, productList, addressId,shippingAdress,userData});

    }else{

        res.redirect('/');

    }
    
    
}

const checkout = async (req, res)=>{
    const userId = req.session.user_id;

    const {
        payment,
        address,
        coupon,
        payment_id,
    } = req.body;

    // console.log(req.body);
    const cart = await cartModel.findOne({userId: userId});

    const orderItemIdList = Promise.all(cart.items.map(async (item)=>{
        const newItem = new orderItemModel({
            product: item.productId,
            quantity: item.quantity,
        })

        const newOrderItem = await newItem.save();
        return newOrderItem._id;
    }))

    const items = await orderItemIdList;

    let newOrder = orderModel({
        user: userId,
        address: address,
        items: items,
        price: cart.cartPrice,
        payment_status: false,
        payment_method: payment,
    });
    
    if(coupon){
        const couponData = await couponModel.findOne({_id: coupon})
      console.log(couponData); ``
        if(payment_id){

            newOrder = orderModel({
                user: userId,
                address: address,
                items: items,
                price: cart.cartPrice - couponData.discount,
                payment_status: true,
                payment_method: payment,
                coupon: coupon,
                razorpay_order_id: payment_id,
            });

        }else{

            newOrder = orderModel({
                user: userId,
                address: address,
                items: items,
                price: cart.cartPrice - couponData.discount,
                payment_status: false,
                payment_method: payment,
                coupon: coupon,
            });

        }

    }else{

        if(payment_id){

            newOrder = orderModel({
                user: userId,
                address: address,
                items: items,
                price: cart.cartPrice,
                payment_status: true,
                payment_method: payment,
                razorpay_order_id: payment_id,
            });

        }

    }


    await newOrder.save()


    cart.items.forEach( async (item)=>{
        const product = await productModel.findOne({_id: item.productId});
        await productModel.updateMany({_id: item.productId},
            {$set: {quantity: product.quantity - item.quantity}})
    })


    await cartModel.deleteOne({userId: userId});

    res.json({response: true, orderId: newOrder._id});

}


const razorpay=async(req,res)=>{
   const {coupon}=req.body;
   const user_id=req.session.user_id
   const user=await userModel.findOne({_id:user_id})
   const cart=await cartModel.findOne({userId:user_id})
   let amount=cart.cartPrice*100

   console.log(cart);
   console.log(amount);
   console.log(typeof amount);

   if(coupon){
        const coupon =await couponModel.findOne({_id:req.body.coupon})
        amount = (cart.cartPrice-coupon.discount)*100
   }

   const options={
     amount:amount,
     currency:"INR",
     receipt:process.env.RAZOR_EMAIL

   }
   razorpayInstance.orders.create(options,
    (err,order)=>{
        if(!err){
            res.status(200).send({
                success:true,
                msg:'order created',
                order_id: order.id,
                amount: amount,
                key_id: process.env.RAZOR_KEY_ID,
                name: user.fullname,
                email: user.email,
            })
        } else{
            console.log(err);
            res.status(400).send({success: false, msg: "something went wrong!"});
        }
    })


   
}


const loadOrderSuccessPage = async (req, res)=>{
    
    const { orderId } = req.query;

    const order = await orderModel.findOne({_id: orderId});
    const user = await userModel.findOne({_id: order.user});
    const address = await addressModel.findOne({_id: order.address});
    
    const product = await orderModel.findOne({_id: orderId})
                                .populate({
                                    path: 'items',
                                    model: 'orderItem',
                                    populate: {
                                        path: 'product',
                                        model: 'products'
                                    }
                                }) 
    const coupon = await couponModel.findOne({_id: order.coupon})
    console.log(coupon);

    res.render('user/orderSuccess',{user, order, address, product, coupon});
}




module.exports = {
    loadCheckoutAddress,
    checkoutAddAddress,
    selectAddress,
    checkout,
loadOrderSuccessPage ,
razorpay
}