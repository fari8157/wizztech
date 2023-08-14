const addressModel = require('../../models/adress');
const cartModel = require('../../models/cartSchema');
const couponModel = require('../../models/coupon');

const loadCoupon = async (req, res)=>{
    try {

        const coupons = await couponModel.find();
        res.render("admin/coupon",{coupons});
        
    } catch (error) {
        throw new Error(error);
    }
} 

const loadAddCoupon = (req, res)=>{
    try {

        res.render('admin/addCoupon');
        
    } catch (error) {
        throw new Error(error)
    }
}

const addCoupon = async (req, res)=>{
    try {
        
        const { 
            
            discount,
            expiryDate,
            minimumAmount,
         } = req.body;
         
        let name = req.body.name.toUpperCase();
        

        const couponExist = await couponModel.findOne({couponName: name});


        if(couponExist){
            res.json({response: false});
        }else{

            const newCoupon = new couponModel({
                couponName: name,
                discount: discount,
                expiryDate: expiryDate,
                minAmount: minimumAmount,
            });

            await newCoupon.save();
            res.json({response: true});
        }


    } catch (error) {
        throw new Error(error)
    }
}

const loadEditCoupon = async (req, res)=>{
    try {

        const { id } = req.query;

        const coupon = await couponModel.findOne({_id: id});
        
        const expDate = coupon.expiryDate.toISOString().substring(0, 10);

        res.render('admin/editCoupon',{coupon, expDate});
        
    } catch (error) {
        throw new Error(error);
    }
}

const editCoupon= async (req, res)=>{
    try {

        const {
            id,
            discount,
            expiryDate,
        } = req.body;

        
        await couponModel.findByIdAndUpdate(id,{discount: discount, expiryDate: expiryDate});
        res.json({response: true});
        
    } catch (error) {
        throw new Error(error);
    }
}





const deleteCoupon = async (req, res)=>{
    try {
        const {id, active} = req.query;

        if(active == "true"){
            await couponModel.findByIdAndUpdate(id, {$set: {isActive: false}});
        }else if(active == "false"){
            await couponModel.findByIdAndUpdate(id, {$set: {isActive: true}});
        }
                
        res.redirect('/admin/coupon');
        
    } catch (error) {
        
    }
}

module.exports = {
    loadAddCoupon,
    addCoupon,
    loadCoupon,
    loadEditCoupon,
    editCoupon,
   
  deleteCoupon,
}