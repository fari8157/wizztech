const { model } = require('mongoose');
const addressModel = require('../../models/adress');
const cartModel = require('../../models/cartSchema');
const couponModel = require('../../models/coupon');


const applyCoupon = async (req, res)=>{
    try {
        const { couponName, addressId, cartPrice } = req.body;

        const coupon = await couponModel.findOne({couponName});
        
        if(coupon){

            if(cartPrice >= coupon.minAmount){

                const address = await addressModel.findOne({_id: addressId})
                const cart = await cartModel.findOne({userId: address.user});
                let productList = [];
                const product = await cartModel
                                        .findOne({userId: address.user})
                                        .populate("items.productId");

                product.items.forEach((item)=>{
                    productList.push(item.productId)
                })

                res.json({response: true, coupon: coupon})

            }else{
                res.json({response: 'min'})
            }

            

        }else{
            res.json({response: false})
        }

        
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    applyCoupon,
}