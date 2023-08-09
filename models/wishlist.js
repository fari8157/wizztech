const mongoose = require('mongoose');
const schema = mongoose.Schema;


const wishlistSchema = schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    items: [
        {
            type: mongoose.Types.ObjectId,
            ref: "products",
            required: true,
        }
    ]
})


module.exports = mongoose.model('wishlist', wishlistSchema);