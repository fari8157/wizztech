const ObjectId = require('mongoose').Types.ObjectId;
const cartModel = require('../../models/cartSchema');
const productModel = require('../../models/product');
const userModel = require('../../models/userschema');
const Category = require('../../models/category');
const wishlistModel = require('../../models/wishlist');
const loadCart = async (req, res) => {
    try {
      const category = await Category.find();
      const userId = req.session.user_id;
      const user = await userModel.findOne({ _id: userId });
      const wishlist=await wishlistModel.findOne({userId:userId})
      let cart = await cartModel.findOne({ userId: req.session.user_id });
      let productList = [];
      let products;
      if (cart) {
        for (const item of cart.items) {
          console.log(item);
          const product = await productModel.findOne({ _id: item.productId });
          console.log(product);
  
          if (item.quantity > product.quantity) {
            await cartModel.updateOne(
              {
                userId: userId,
                "items.productId": item.productId,
              },
              { $set: { "items.$.quantity": product.quantity } }
            );
          }
        }
  
        products = await cartModel
          .findOne({ userId: req.session.user_id })
          .populate("items.productId");
  
        products.items.forEach((item) => {
          productList.push(item.productId);
        });
      }
  
      console.log(products);
  
      res.render("user/cart", {
        userId,
        user,
        products,
        productList,
        category,
        cart,
        wishlist,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  
  const addToCart = async (req, res) => {
    try {
      const { productId } = req.query;
      const userId = req.session.user_id;
  
      const cart = await cartModel.findOne({ userId: userId });
      const product = await productModel.findOne({ _id: productId });
  
      if (cart) {
        let productExist = await cartModel.findOne({
          userId: userId,
          "items.productId": productId,
        });
  
        if (productExist) {
          const cartProduct = cart.items.find(
            (item) => item.productId == productId
          );
  
          if (cartProduct.quantity >= product.quantity) {
            res.json({ response: false });
          } else {
            await cartModel.findOneAndUpdate(
              { userId: userId, "items.productId": productId },
              {
                $inc: {
                  "items.$.quantity": 1,
                  "items.$.totalPrice": product.price,
                },
              }
            );
          }
        } else {
          await cartModel.findOneAndUpdate(
            { userId: userId },
            {
              $push: {
                items: [
                  {
                    productId,
                    totalPrice: product.price,
                  },
                ],
              },
            }
          );
        }
      } else {
        const newItem = new cartModel({
          userId: userId,
          items: [
            {
              productId,
              totalPrice: product.price,
            },
          ],
        });
        await newItem.save();
      }
  
      const cartTotalPrice = await cartModel.aggregate([
        {
          $match: { userId: new ObjectId(userId) },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$items.totalPrice" },
          },
        },
      ]);
  
      await cartModel.updateOne(
        { userId: userId },
        { $set: { cartPrice: cartTotalPrice[0].total } }
      );
  
      res.json({ response: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const quantityDecrement = async (req, res) => {
    try {
      const { userId, productId } = req.query;
      const product = await productModel.findOne({ _id: productId });
  
      await cartModel.findOneAndUpdate(
        { userId: userId, "items.productId": productId },
        {
          $inc: {
            "items.$.quantity": -1,
            "items.$.totalPrice": -product.price,
            cartPrice: -product.price,
          },
        }
      );
  
      res.json({ response: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const quantityIncrement = async (req, res) => {
    try {
      const { userId, productId } = req.query;
      const product = await productModel.findOne({ _id: productId });
  
      await cartModel.findOneAndUpdate(
        { userId: userId, "items.productId": productId },
        {
          $inc: {
            "items.$.quantity": 1,
            "items.$.totalPrice": product.price,
            cartPrice: product.price,
          },
        }
      );
  
      res.json({ response: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const removeItem = async (req, res) => {
    try {
      const { productId, userId } = req.query;
  
      await cartModel.findOneAndUpdate(
        { userId: userId, "items.productId": productId },
        {
          $pull: {
            items: { productId: productId },
          },
        }
      );
  
      const cart = await cartModel.findOne({ userId: userId });
  
      if (cart.items.length > 0) {
        const cartTotalPrice = await cartModel.aggregate([
          {
            $match: { userId: new ObjectId(userId) },
          },
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: null,
              totalcost: { $sum: "$items.totalPrice" },
            },
          },
        ]);
  
        await cartModel.updateOne(
          { userId: userId },
          { $set: { cartPrice: cartTotalPrice[0].totalcost } }
        );
      } else {
        await cartModel.updateOne({ userId: userId }, { cartPrice: 0 });
      }
  
      res.json({ response: true });
    } catch (error) {
      console.log(error.message);
    }
  };
module.exports = {
    loadCart,
    addToCart,
    quantityDecrement,
    quantityIncrement,
    removeItem,
}