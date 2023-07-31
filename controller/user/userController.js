const Category = require('../../models/category');
const Product = require('../../models/product');
const User = require('../../models/userschema');
const addressModel = require('../../models/adress');
const cartModel=require('../../models/cartSchema')
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');


const loadHome = async (req, res) => {
    const category = await Category.find()
    const product = await Product.find({isActive:true})
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    res.render('user/home', { category: category, product: product, user, userId })
}

const loadShop = async (req, res) => {
    const userId = req.session.user_id;
    const user = await User.findOne({ _id: userId });
    const product = await Product.find({isActive:true})
    const category = await Category.find()
    res.render('user/shop', { product: product, category: category, userId, user })
}

const loadDtails = async (req, res) => {
    const id = req.query.id
    const product = await Product.findOne({ _id: id })
    console.log(product);
    const products = await Product.find()
    const category = await Category.find()
    const userId = req.session.user_id;
    const user = await User.findOne({ _id: userId });
    res.render('user/details', { product: product, category: category, products: products, userId, user })

}


const userLogout = async (req, res) => {
    try {
        req.session.user_id = null
        res.clearCookie('user_id')
        res.redirect('/')


    } catch (error) {
        console.log(error.message);
    }
}

const forceLogout = async (req,res) =>{
    try{
        req.session.user_id = null
        res.clearCookie('user_id')
        res.redirect('/')
    }catch(err){
        console.log(error.message);
    }
}

const loadprofile = async (req, res) => {
    if (req.session.user_id) {

        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        console.log(user);
        const category = await Category.find()

        if (user) {
            res.render("user/profile", { user, category, userId }); // Pass the 'user' object as a parameter
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

loadUpdateUser = async (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        console.log(user);

        if (user) {
            res.render("user/updateUser", { user })
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
}
postUpdateUser = async (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;
        await User.findByIdAndUpdate(userId, {
            fullname: req.body.fullname

        })
        res.redirect('/profile')
    } else {
        res.redirect('/profile')
    }



}

loadVerifyOldPassword = async (req, res) => {
    res.render("user/verifyoldpass", { message: null })
}
postVerifyOldPassword = async (req, res) => {

    const password = req.body.password;
    const userId = req.session.user_id;
    const user = await User.findOne({ _id: userId });
    console.log(user);
    const pass = await bcrypt.compare(password, user.password);

    if (pass) {
        res.redirect("/profile/newPassword")
    } else {
        res.render("user/verifyoldpass", { message: "check password" })
    }
}



loadNewpass = async (req, res) => {
    res.render("user/newPass")
}
postNewpass = async (req, res) => {

    const password = req.body.password;
    const userId = req.session.user_id;
    const passwordHash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, {
        password: passwordHash

    })
    res.redirect("/profile")
}

loadAddAddress = async (req, res) => {
    const contact = await addressModel.findOne({ user: req.session.user_id, type: "contact" });
    const main = await addressModel.findOne({ user: req.session.user_id, type: "main" });
    const secondary = await addressModel.find({ user: req.session.user_id, type: "secondary" });
    res.render('user/address', { contact, main, secondary })
}
loadWishlist = async (req, res) => {
    res.render('user/wishlist')
}
loadAddnewAddress = async (req, res) => {
    const type = req.query.type;
    res.render('user/addadress', { type })
}




const addNewAddress = async (req, res) => {
    const userId = req.session.user_id;

    const {
        building,
        street,
        city,
        state,
        country,
        type,
    } = req.body;

    const zipcode = parseInt(req.body.zipcode);
    const phone = parseInt(req.body.phone);

    const newAddress = new addressModel({
        buildingName: building,
        street,
        city,
        state,
        zipCode: zipcode,
        country,
        phoneNumber: phone,
        type,
        user: userId
    })

    await newAddress.save();
    res.redirect('/addAddress');

}




module.exports = {
    loadHome,
    loadShop,
    loadDtails,
    loadprofile,
    loadUpdateUser,
    loadVerifyOldPassword,
    loadNewpass,
    
    loadAddAddress,
    loadWishlist,
    userLogout,
    postUpdateUser,
    postVerifyOldPassword,
    postNewpass,
    loadAddnewAddress,
    addNewAddress,
    forceLogout
  
  
}