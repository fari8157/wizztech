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
const address=require("../controller/user/addressController")
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
 routers.get("/forgetPassword",adminAuth.isLogout,authcontroller.loadForgetpass)
 routers.post("/forgetPassword",authcontroller.forgetPass)
 routers.get("/forget/otp",adminAuth.isLogout,authcontroller.loadForgetOtp)
 routers.post("/forget/otp",authcontroller.forgetOtp)
 routers.post("/resetPassword",authcontroller.updatePassword)
///...profile...///
 routers.get("/profile",userAuth.isLogout,home.loadprofile)
 routers.get("/profile/userUpdate",userAuth.isLogin,home.loadUpdateUser)
 routers.post("/profile/userUpdate",home.postUpdateUser)
 routers.get("/profile/verifyPassword",userAuth.isLogin,home.loadVerifyOldPassword)
 routers.post("/profile/verifyPassword",home.postVerifyOldPassword)
 
 routers.get("/profile/newPassword",userAuth.isLogin,home.loadNewpass)
 routers.post("/profile/newPassword",home.postNewpass)
 
 //....cart...//
 routers.get("/cart",userAuth.isLogin,cart.loadCart)
 routers.get("/addCart",cart.addToCart)
 routers.get('/incrementQuantity',cart.quantityIncrement)
 routers.get('/decrementQuantity',cart.quantityDecrement)
 routers.delete('/removeItem',cart.removeItem)
//....checkOutAddress...//
routers.get('/checkout/address',userAuth.isLogin,checkoutAddress.loadCheckoutAddress)
routers.post('/checkout/addAdress',checkoutAddress.checkoutAddAddress)
routers.get('/checkout',userAuth.isLogin,checkoutAddress.selectAddress)
routers.post('/checkout',checkoutAddress.checkout) 
routers.post('/razorpay',checkoutAddress.razorpay);

routers.post('/checkout/couponApply',couponApply.applyCoupon)
routers.get('/order/success',checkoutAddress.loadOrderSuccessPage)


 routers.get("/order",userAuth.isLogin,order.loadorder)
 routers.get('/order/details',userAuth.isLogin,userAuth.isLogin,order.loadOrderDetails);
 routers.post('/order/cancel',order.cancelOrder);
 routers.post('/order/return',order.orderReturn);

 routers.get('/wallet',userAuth.isLogin,wallet.loadWallet);


 routers.get("/addAddress",userAuth.isLogin,address.loadAddress)
 routers.delete('/address/delete',address.deleteAddress);
 routers.get("/profile/editAddress",userAuth.isLogin,address.loadEditAddress)
 routers.post("/profile/editAddress",address.editAddress)
 routers.get("/profile/addnewadress",userAuth.isLogin,address.loadAddnewAddress)
 routers.post("/profile/addnewadress",address.addNewAddress)
//  routers.get("/wishlist",home.loadWishlist)

 routers.get('/wishlist',userAuth.isLogin,wishlist.loadWishlist);
 routers.get('/addToWishlist',wishlist.addToWishlist);






module.exports=routers