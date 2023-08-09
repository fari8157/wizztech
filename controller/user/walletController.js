const cartModel = require("../../models/cartSchema");
const userModel = require("../../models/userschema");
const walletModel = require("../../models/wallet");


const loadWallet = async (req, res)=>{
    try {

        const userId = req.session.user_id;

        const user = await userModel.findById(userId);
        const wallet = await walletModel.findOne({user: userId});
        const cart = await cartModel.findOne({userId: userId});

        res.render("user/wallet",{id: userId, user, wallet, cart});
        
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadWallet,
}