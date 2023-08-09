const authcontroller=require('../controller/user/authcontroller')
const home=require('../controller/user/userController')
const express=require("express")
const routers=express.Router()
const userAuth = require('../middleware/user')
const adminAuth = require('../middleware/admin')
const cart=require('../controller/user/cartController')
const checkoutAddress=require('../controller/user/orderController')
const order=require('../controller/user/orderItems')
const couponApply=require('../controller/user/coupon')
const categoryC=require("../controller/user/category")
const wallet=require("../controller/user/walletController")
const wishlist=require("../controller/user/wishlist")
/// login&signup...//
routers.get("/login",adminAuth.isLogout,userAuth.isLogout,authcontroller.loginLoad)
routers.post("/login",authcontroller.verifyLogin)
routers.get("/register",adminAuth.isLogout,userAuth.isLogout,authcontroller.loadRegister);
 routers.post("/register", authcontroller.insertUser);
 routers.get("/logout",home.userLogout)
 routers.get('/access', home.forceLogout)

 
//  routers.get("/verifyemail", authcontroller.verifyEmail);
//  routers.get("/successemail/:username",authcontroller.successEmail)


//....otp....//
 routers.get("/login/otp",userAuth.isLogout,authcontroller.loadotp)
 routers.post("/login/otp",userAuth.isLogout,authcontroller.otpVerify)
 //... home...//
 routers.get("/",adminAuth.isLogout,home.loadHome)
 routers.get("/shop",userAuth.isLogout,home.loadShop)
 routers.get("/details",userAuth.isLogout,home.loadDtails)
 routers.get("/category",categoryC.loadCategory)
//.... forgetpassword..//
 routers.get("/forgetPassword",authcontroller.loadForgetpass)
 routers.post("/forgetPassword",authcontroller.forgetPass)
 routers.get("/forget/otp",authcontroller.loadForgetOtp)
 routers.post("/forget/otp",authcontroller.forgetOtp)
 routers.post("/resetPassword",authcontroller.updatePassword)
///...profile...///
 routers.get("/profile",userAuth.isLogout,home.loadprofile)
 routers.get("/profile/userUpdate",home.loadUpdateUser)
 routers.post("/profile/userUpdate",home.postUpdateUser)
 routers.get("/profile/verifyPassword",home.loadVerifyOldPassword)
 routers.post("/profile/verifyPassword",home.postVerifyOldPassword)
 routers.get("/profile/addnewadress",home.loadAddnewAddress)
 routers.post("/profile/addnewadress",home.addNewAddress)
 routers.get("/profile/newPassword",home.loadNewpass)
 routers.post("/profile/newPassword",home.postNewpass)
 
 //....cart...//
 routers.get("/cart",cart.loadCart)
 routers.get("/addCart",cart.addToCart)
 routers.get('/incrementQuantity',cart.quantityIncrement)
 routers.get('/decrementQuantity',cart.quantityDecrement)
 routers.delete('/removeItem',cart.removeItem)
//....checkOutAddress...//
routers.get('/checkout/address',checkoutAddress.loadCheckoutAddress)
routers.post('/checkout/addAdress',checkoutAddress.checkoutAddAddress)
routers.get('/checkout',checkoutAddress.selectAddress)
routers.post('/checkout',checkoutAddress.checkout) 
routers.post('/razorpay',checkoutAddress.razorpay);

routers.post('/checkout/couponApply',couponApply.applyCoupon)
routers.get('/order/success',checkoutAddress.loadOrderSuccessPage)


 routers.get("/order",userAuth.isLogin,order.loadorder)
 routers.get('/order/details',userAuth.isLogin,userAuth.isLogin,order.loadOrderDetails);
 routers.post('/order/cancel',order.cancelOrder);
 routers.post('/order/return',order.orderReturn);

 routers.get('/wallet',userAuth.isLogin,wallet.loadWallet);


 routers.get("/addAddress",home.loadAddAddress)
//  routers.get("/wishlist",home.loadWishlist)

 routers.get('/wishlist',wishlist.loadWishlist);
 routers.get('/addToWishlist',wishlist.addToWishlist);






module.exports=routers