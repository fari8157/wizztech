const orderItemModel = require("../../models/orderItem");
const orderModel = require("../../models/order");
const userModel = require("../../models/userschema");
const couponModel = require("../../models/coupon");
const cartModel = require("../../models/cartSchema");
const productModel = require("../../models/product");
const walletModel = require('../../models/wallet');

const loadorder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const userData = await userModel.findOne({ _id: userId });
        const orders = await orderModel.findOne({ user: userId }).sort({ order_date: -1 });
        

        const products = await orderModel.find({ user: userId })
            .populate({
                path: 'items',
                model: 'orderItem',
                populate: {
                    path: 'product',
                    model: 'products'
                }
            })
            .sort({ order_date: -1 });

        console.log(products);

        res.render('user/order', { products, orders, user: userData });
    } catch (error) {
        res.render("user/404")
    }
};

const loadOrderDetails = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { orderId } = req.query;

        const user = await userModel.findOne({ _id: userId });
        const order = await orderModel.findOne({ _id: orderId })
            .populate({
                path: 'items',
                model: 'orderItem',
                populate: {
                    path: 'product',
                    model: 'products'
                }
            });
        
        const coupon = await couponModel.findOne({ _id: order.coupon });
        const cartAddress = await orderModel.findOne({ _id: orderId }).populate("address");
        const cart = await cartModel.findOne({ userId: userId });

        res.render('user/orderDetails', { id: userId, user, order, coupon, address: cartAddress.address, cart });
    } catch (error) {
        res.render("user/404")
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findOne({ _id: orderId }).populate('items');

        if (order.payment_method === "online" || order.payment_method === "wallet") {
            const wallet = await walletModel.findOne({ user: order.user });
            if (!wallet) {
             const  wallet = new walletModel({
                    user: order.user,
                    balance: order.price,
                    history: [{
                        type: "add",
                        amount: order.price,
                        newBalance: order.price
                    }]
                });
    
                await wallet.save();
            }else{
                let balance = wallet.balance;
                const newBalance = balance + order.price;
                const history = {
                    type: "add",
                    amount: order.price,
                    newBalance: newBalance,
                };

                wallet.balance = newBalance;
                wallet.history.push(history);
                wallet.save();
            }

        }

        await orderModel.findByIdAndUpdate(orderId, { order_status: "cancelled" });


        for (const item of order.items) {
            await productModel.updateOne({ _id: item.product },
                { $inc: { quantity: item.quantity } });
        }

        res.send({ response: true });
    } catch (error) {
        res.render("user/404")
    }
};

const orderReturn = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findById(orderId).populate("items");
        let wallet = await walletModel.findOne({ user: order.user });

        if (!wallet) {
            wallet = new walletModel({
                user: order.user,
                balance: order.price,
                history: [{
                    type: "add",
                    amount: order.price,
                    newBalance: order.price
                }]
            });

            await wallet.save();

            order.order_status = "cancelled";
            await order.save();
        } else {
            let balance = wallet.balance;
            let newBalance = balance + order.price;
            let history = {
                type: "add",
                amount: order.price,
                newBalance: newBalance
            };

            wallet.balance = newBalance;
            wallet.history.push(history);
            await wallet.save();

            order.order_status = "cancelled";
            await order.save();
        }

        for (const item of order.items) {
            await productModel.updateOne({ _id: item.product },
                { $inc: { quantity: item.quantity } });
        }

        if (wallet) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    } catch (error) {
        res.render("user/404")
    }
};

module.exports = {
    loadorder,
    loadOrderDetails,
    cancelOrder,
    orderReturn
};
