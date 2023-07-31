const categoryModel =require("../../models/category")
const productModel=require("../../models/product")
const userModel=require("../../models/userschema")



const loadCategory= async(req,res)=>{
    const userId=req.session.user_id
    const categoryId=req.query.id
    const user=await userModel.findOne({_id:userId})
    const product= await productModel.find({ category:categoryId})
    const category= await categoryModel.find()
    res.render("user/shop",{user,product,category,userId})

}


module.exports={
    loadCategory,
}