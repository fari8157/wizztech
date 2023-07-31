const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
          },
          image: [{
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }],
          coverImage:{
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
          },
          price: {
            type: Number,
            required: true,
          },
          brand: {
            type: String,
            required: true,
          },
          color: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
         
          quantity: {
            type: Number,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          specifications: {
            type: String,
            required: true,
          },
          blurb: {
            type: String,
            required: true,
          },
          isActive:{
            type:Boolean,
            required:true,
            default:true
          }
    }
    
);



module.exports = mongoose.model("products", productSchema);


