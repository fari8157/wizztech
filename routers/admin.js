const category=require("../controller/adminControler/category")
const customer=require("../controller/adminControler/customer")
const adminHome=require("../controller/adminControler/home")
const product = require("../controller/adminControler/product");
const login=require("../controller/adminControler/authcontroller")
const adminAuth = require('../middleware/admin');
const adminControler=require("../controller/adminControler/adminController");
const order=require('../controller/adminControler/order')
const coupon=require('../controller/adminControler/coupon')
const bannerController=require("../controller/adminControler/bannerController")
const express=require("express")
const routers=express.Router()


routers.get("/login",login.loadlogin)
routers.post("/login",login.verify)

routers.get('/category',adminAuth.isLogin,category.loadCategory)
// routers.post('/categorires',category.loadCategory)
routers.get('/addcategory',category.loadAddCategory)
routers.post('/addcategory',category.addCategory)
routers.get('/editCategory',category.loadEditCategory)
routers.post('/editCategory',category.editCategory)
routers.get('/customer',customer.userTable)
routers.get('/editCustomer',customer.loadEditUser)
routers.post('/customer',customer. updateUser );
routers.get("/",adminAuth.isLogin,adminHome.adminHome)
routers.get('/products',product.loadProduct)
routers.get('/addproduct',product.loadaddProducts)
routers.post('/addproduct',product.addProducts)
routers.get("/editproduct",product.loadProductEdit)
routers.get('/editProductImages', product.loadImageEdit);
routers.get("/product/edit/coverImage",product.loadCoverImage)
routers.post("/product/edit/coverImage",product.postCoverImage)


routers.post("/editproduct",product.productEdit)
// routers.get('/dashboard',product.dashboard)
routers.delete('/product/image/delete',product.deleteProductImage)
routers.get('/product/image/add',product.loadAddImage);
routers.post('/product/image/add',product.editProductImages);
routers.get('/product/delete',product.deleteProduct)
routers.get('/logout',adminControler.adminlogout)


routers.get('/order',adminAuth.isLogin,order.loadorder)
routers.get('/orderDetails',adminAuth.isLogin,order.loadOrderDetails)
routers.post('/order/status',order.statusChange)



routers.get('/coupon',coupon.loadCoupon)
routers.get('/coupon/addCoupon',coupon.loadAddCoupon)
routers.post('/coupon/addCoupon',coupon.addCoupon)
routers.get('/coupon/edit',coupon.loadEditCoupon)
routers.post('/coupon/edit',coupon.editCoupon)
routers.get('/coupon/delete',coupon.deleteCoupon)

routers.get('/banner',adminAuth.isLogin,bannerController.loadBanner);
routers.get('/banner/add',adminAuth.isLogin,bannerController.loadAddBanner);
routers.post('/banner/add',bannerController.addBanner);
routers.get('/banner/edit',adminAuth.isLogin,bannerController.loadEditBanner);
routers.post('/banner/edit',bannerController.editBanner);


module.exports=routers