
const orderItemModel = require("../../models/orderItem");
const orderModel = require("../../models/order");
const userModel = require("../../models/userschema");


const loadorder = async (req, res)=>{
    const userId = req.session.user_id;
    const userData = await userModel.findOne({_id: userId});
    const orders = await orderModel.findOne({user: userId});
    console.log(orders);
   
    let products = [];
    for(const item of orders.items){
        const product = await orderItemModel.findOne({_id: item}).populate("product")
        products.push(product)
    }
    
    res.render('user/order',{products, orders, user: userData});
}


module.exports = {
    loadorder,
}






