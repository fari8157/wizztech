const Category = require('../../models/category');
const Product = require('../../models/product');
const User = require('../../models/userschema');
const addressModel = require('../../models/adress');
const cartModel = require('../../models/cartSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const wishlist=require("../user/wishlist");
const wishlistModel = require('../../models/wishlist');
const loadHome = async (req, res) => {
    try {
        const category = await Category.find();
        const product = await Product.find({ isActive: true });
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        const cart = await cartModel.findOne({ userId: userId });
        const wishlist=await wishlistModel.findOne({ userId: userId})
        res.render('user/home', { category: category, product: product, user, userId, cart,wishlist });
    } catch (error) {
        console.error('Error loading home:', error);
        res.status(500).send('Server Error');
    }
};

const loadShop = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        const category = await Category.find();
        const cart = await cartModel.findOne({ userId: userId });
        const wishlist=await wishlistModel.findOne({ userId: userId})
        const ITEMS_PER_PAGE = 6;
        const page = +req.query.page || 1;
        const search = req.query.search || '';
        let minamount = 0;
        let maxamount = 5000;

        if (req.query.minamount || req.query.maxamount) {
            minamount = parseInt(req.query.minamount);
            maxamount = parseInt(req.query.maxamount);
        }

        const query = {
            isActive: true,
            $or: [{ name: new RegExp(search, 'i') }],
            $and: [{ price: { $gt: minamount } }, { price: { $lt: maxamount } }]
        };

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('user/shop', {
            product: products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
            userId,
            user,
            category,
            search,
            minamount,
            maxamount,
            cart,
            wishlist,
        });
    } catch (error) {
        console.error('Error loading shop:', error);
        res.status(500).send('Server Error');
    }
};

const loadDtails = async (req, res) => {
    try {
        const id = req.query.id;
        const product = await Product.findOne({ _id: id });
        const products = await Product.find();
        const category = await Category.find();
        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        const cart = await cartModel.findOne({ userId: userId });
        const wishlist = await wishlistModel.findOne({userId});
        res.render('user/details', { product: product, category: category, products: products, userId, user, cart,wishlist });
    } catch (error) {
        console.error('Error loading details:', error);
        res.status(500).send('Server Error');
    }
};

const userLogout = async (req, res) => {
    try {
        req.session.user_id = null;
        res.clearCookie('user_id');
        res.redirect('/');
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
};

const forceLogout = async (req, res) => {
    try {
        req.session.user_id = null;
        res.clearCookie('user_id');
        res.redirect('/');
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
};

const loadprofile = async (req, res) => {
    try {
        if (req.session.user_id) {
            const userId = req.session.user_id;
            const user = await User.findOne({ _id: userId });
            const category = await Category.find();
            const cart = await cartModel.findOne({ userId: userId });

            if (user) {
                res.render("user/profile", { user, category, userId, cart });
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).send('Server Error');
    }
};

loadUpdateUser = async (req, res) => {
    try {
        if (req.session.user_id) {
            const userId = req.session.user_id;
            const user = await User.findOne({ _id: userId });

            if (user) {
                res.render("user/updateUser", { user });
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.error('Error loading update user:', error);
        res.status(500).send('Server Error');
    }
};

postUpdateUser = async (req, res) => {
    try {
        if (req.session.user_id) {
            const userId = req.session.user_id;
            await User.findByIdAndUpdate(userId, { fullname: req.body.fullname });
            res.redirect('/profile');
        } else {
            res.redirect('/profile');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server Error');
    }
};
loadVerifyOldPassword = async (req, res) => {
    try {
        res.render("user/verifyoldpass", { message: null });
    } catch (error) {
        console.error('Error loading verify old password page:', error);
        res.status(500).send('Server Error');
    }
};
postVerifyOldPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const userId = req.session.user_id;
        const user = await User.findOne({ _id: userId });
        console.log(user);
        const pass = await bcrypt.compare(password, user.password);

        if (pass) {
            res.redirect("/profile/newPassword");
        } else {
            res.render("user/verifyoldpass", { message: "check password" });
        }
    } catch (error) {
        console.error('Error verifying old password:', error);
        res.status(500).send('Server Error');
    }
};

loadNewpass = async (req, res) => {
    try {
        res.render("user/newPass");
    } catch (error) {
        console.error('Error loading new password page:', error);
        res.status(500).send('Server Error');
    }
};

postNewpass = async (req, res) => {
    try {
        const password = req.body.password;
        const userId = req.session.user_id;
        const passwordHash = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(userId, { password: passwordHash });
        res.redirect("/profile");
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Server Error');
    }
};

loadAddAddress = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user_id });
        const contact = await addressModel.findOne({ user: req.session.user_id, type: "contact" });
        const main = await addressModel.findOne({ user: req.session.user_id, type: "main" });
        const secondary = await addressModel.find({ user: req.session.user_id, type: "secondary" });
       
        res.render('user/address', { contact, main, secondary,user });
    } catch (error) {
        console.error('Error loading address page:', error);
        res.status(500).send('Server Error');
    }
};



loadAddnewAddress = async (req, res) => {
    try {
        const user = await User.findOne({ _id:  req.session.user_id });
        const type = req.query.type;
        res.render('user/addadress', { type ,user});
    } catch (error) {
        console.error('Error loading add new address page:', error);
        res.status(500).send('Server Error');
    }
};

const addNewAddress = async (req, res) => {
    try {
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
        });

        await newAddress.save();
        res.redirect('/addAddress');
    } catch (error) {
        console.error('Error adding new address:', error);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    loadHome,
    loadShop,
    loadDtails,
    loadprofile,
    loadUpdateUser,
    loadVerifyOldPassword,
    loadNewpass,
    loadAddAddress,
  
    userLogout,
    postUpdateUser,
    postVerifyOldPassword,
    postNewpass,
    loadAddnewAddress,
    addNewAddress,
    forceLogout
};
