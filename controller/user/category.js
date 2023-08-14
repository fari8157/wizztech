const categoryModel =require("../../models/category")
const productModel=require("../../models/product")
const userModel=require("../../models/userschema")
const wishlistModel=require("../../models/wishlist")



const loadCategory = async (req, res) => {
    try {
        const ITEMS_PER_PAGE = 6; // Number of products to display per page
        const page = +req.query.page || 1;
        const userId = req.session.user_id;
        const categoryId = req.query.id;
        
        const user = await userModel.findOne({ _id: userId });
        const category = await categoryModel.find();
        const wishlist=await wishlistModel.findOne({userId:userId})
        const search = req.query.search || '';
        let minamount = 0;
        let maxamount = 5000;

        if (req.query.minamount || req.query.maxamount) {
            minamount = parseInt(req.query.minamount);
            maxamount = parseInt(req.query.maxamount);
        }

        let query = { category: categoryId, isActive: true };

        // Apply search query
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }];
        }

        // Apply price filter
        query.$and = [{ price: { $gt: minamount } }, { price: { $lt: maxamount } }];

        // Fetch products based on the query
        const totalProducts = await productModel.countDocuments(query);
        const products = await productModel.find(query)
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
            wishlist,
        });
    } catch (error) {
        res.render("user/404")
    }
};





module.exports={
    loadCategory,
}