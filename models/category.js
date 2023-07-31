const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
      },
   
});
const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
