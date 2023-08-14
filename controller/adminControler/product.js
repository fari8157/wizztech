const cloudinary = require('cloudinary').v2;
const categoryModel=require('../../models/category')
const productModel=require("../../models/product")
const {multipleImage, imageUpload} = require('../../utility/uploadImage');
const deleteImage = require('../../utility/deleteImage');



const loadProduct=async(req,res)=>{
    try{
    const products=await productModel.find()
    const category=await categoryModel.find()
    res.render("admin/product",{products,category})
}catch (error){
    res.render("user/404")
   
}}
const loadaddProducts=async(req,res)=>{
  const category=await categoryModel.find()
    res.render("admin/addProduct",{message:null,category})
}






const addProducts = async (req, res)=>{
    try{

        
        const productName = req.body.name;
        const category = req.body.category;
    
        let price = req.body.price;
        let quantity = req.body.quantity;
        const blurb = req.body.blurb;
        const description = req.body.description;
        const specifications=req.body.specification
        const brand=req.body.brand
        const color=req.body.color
        const images = req.files.images;
        const coverImage=req.files.coverimage
        console.log(coverImage);
        
        price = parseFloat(price);
        quantity = parseInt(quantity);
        const productCoverImage=await imageUpload(coverImage)
        const urlList = await multipleImage(images);
        
        console.log(productCoverImage);
        
        const newProduct =  productModel({
            name: productName,
            category: category,
            coverImage:productCoverImage,
            price: price,
            quantity: quantity,
            blurb: blurb,
            description: description,
            image: urlList,
            brand:brand,
            color:color,
            specifications:specifications
        })

        await newProduct.save();
        // res.render('admin/addProduct',{message:"product added"});
        res.json({ success: true });
        
    }catch(err){
        console.log(err);
        res.json({ success: false });
    }

}
const loadProductEdit=async(req,res)=>{
    const id=req.query.id
    const productData= await productModel.findOne({_id:id})
    res.render("admin/editProducts",{Data:productData})
 }

 const productEdit=async(req,res)=>{
    const id=req.query.id
     
    const productName = req.body.name;
    const category = req.body.category;
  
    let price = req.body.price;
    let quantity = req.body.quantity;
    const blurb = req.body.blurb;
    const description = req.body.description;
    const specifications=req.body.specification
    const brand=req.body.brand
    const color=req.body.color
   
    price = parseFloat(price);
    quantity = parseInt(quantity);

    await productModel.findByIdAndUpdate(id,{$set:{
        name:productName,
        category:category, 
       
         price:price,
        quantity :quantity,
         blurb :blurb,
         description :description,
         specifications:specifications,
         brand:brand,
         color:color,
        }})
        res.redirect("/admin/products/")

    }
  const  loadImageEdit=async(req,res)=>{
    const id = req.query.id;
    const product = await productModel.findById(id);
    res.render('admin/productImageEdit', { product, images: product.image });
  }

  const deleteProductImage = async (req, res)=>{
    const { public_id, productId } = req.query;

    await deleteImage(public_id);
    
   

    await productModel.updateOne({_id: productId, "image.public_id": public_id},
        {
            $pull: {
                "image": {public_id: public_id}
            }
        }
    )



    
    res.json({response: true})
}

const loadAddImage = (req, res)=>{
    try {

        const {productId} = req.query;
        
        res.render('admin/addImage',{productId})

    } catch (error) {
        console.log(error);
    }
}

const editProductImages = async (req, res)=>{
    try {

        const { image } = req.files;
        const { productId } = req.query;

        const result = await imageUpload(image);

        await productModel.updateOne({_id: productId},
            {
                $push: {
                    image: result 
                }
            })
        
        res.redirect('/admin/products')
        
    } catch (error) {
        console.log(error);
    }
}


   
 const deleteProduct = async (req, res)=>{
    try {
        const {id, active} = req.query;

        if(active == "true"){
            await productModel.findByIdAndUpdate(id, {$set: {isActive: false}});
        }else if(active == "false"){
            await productModel.findByIdAndUpdate(id, {$set: {isActive: true}});
        }
                
        res.redirect('/admin/products');
        
    } catch (error) {
        console.log(error);
    }
}

loadCoverImage=async(req,res)=>{
  const {productId} = req.query;
  const productData= await productModel.findOne({_id:productId})
  console.log(productData);

  res.render("admin/coverImageEdit",{productData})
        
}
postCoverImage=async(req,res)=>{
  const {productId} = req.query;
  const {coverImage} = req.files
  const Image=await imageUpload(coverImage)
  await productModel.findByIdAndUpdate(productId,{coverImage:Image})
  res.redirect("/admin/products")
}

module.exports={
   addProducts,
   loadaddProducts,
   loadProduct,
   loadProductEdit,
   productEdit,
   deleteProduct,
   loadImageEdit,
   editProductImages,
   deleteProductImage,
   loadAddImage,
   loadCoverImage,
   postCoverImage,
}