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
routers.get('/addcategory',adminAuth.isLogin,category.loadAddCategory)
routers.post('/addcategory',category.addCategory)
routers.get('/editCategory',adminAuth.isLogin,category.loadEditCategory)
routers.post('/editCategory',category.editCategory)
routers.get('/customer',adminAuth.isLogin,customer.userTable)
routers.get('/editCustomer',adminAuth.isLogin,customer.loadEditUser)
routers.post('/customer',customer. updateUser );
routers.get("/",adminAuth.isLogin,adminHome.adminHome)
routers.get('/products',adminAuth.isLogin,product.loadProduct)
routers.get('/addproduct',adminAuth.isLogin,product.loadaddProducts)
routers.post('/addproduct',product.addProducts)
routers.get("/editproduct",adminAuth.isLogin,product.loadProductEdit)
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



routers.get('/coupon',adminAuth.isLogin,coupon.loadCoupon)
routers.get('/coupon/addCoupon',adminAuth.isLogin,coupon.loadAddCoupon)
routers.post('/coupon/addCoupon',coupon.addCoupon)
routers.get('/coupon/edit',adminAuth.isLogin,coupon.loadEditCoupon)
routers.post('/coupon/edit',coupon.editCoupon)
routers.get('/coupon/delete',adminAuth.isLogin,coupon.deleteCoupon)

routers.get('/banner',adminAuth.isLogin,bannerController.loadBanner);
routers.get('/banner/add',adminAuth.isLogin,bannerController.loadAddBanner);
routers.post('/banner/add',bannerController.addBanner);
routers.get('/banner/edit',adminAuth.isLogin,bannerController.loadEditBanner);
routers.post('/banner/edit',bannerController.editBanner);

routers.get('/sale',adminAuth.isLogin,adminHome.loadSalesReport);
routers.post('/sale/monthly',adminHome.monthlySaleReport);
routers.post('/sale/daily',adminHome.dailySalesReport);
routers.post('/sale/date',adminHome.byDateSaleReport);



module.exports=routers