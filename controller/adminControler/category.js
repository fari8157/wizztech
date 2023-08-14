const Category=require('../../models/category')
const cloudinary = require('cloudinary').v2;


const loadCategory = async (req, res) => {
  const pageSize = 5;
  const currentPage = parseInt(req.query.page) || 1;

  try {
    const totalCategoriesCount = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategoriesCount / pageSize);

    const categories = await Category.find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.render("admin/category", {
      cat: categories,
      page: currentPage,
      totalPages: totalPages,
      message: null // Add this line to provide a default value for the message
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

  
  const loadAddCategory = async (req, res) => {
    res.render("admin/addcategory", { message: null });
  };
  const imageUpload = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "imagesfortesh",
      });
      console.log(result.url);
      return result.url;
    } catch (err) {
      console.log(err);
    }
  };
  
  const addCategory = async (req, res) => {
    const name = req.body.name;
    const image = req.files.images;
  
    try {
      const imageUrl = await imageUpload(image);
  
      var existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      console.log(existingCategory);
  
      if (existingCategory) {
        return res.render("admin/addCategory", { message: "Already exists" });
      } else {
        var category = new Category({ name: name, images: imageUrl });
        await category.save();
        return res.redirect("/admin/category");
      }
    } catch (error) {
     
    }
  };
  

  
  
  
const loadEditCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const categories = await Category.findById(categoryId);

   

    res.render("admin/editCategory", { category:categories });
  } catch (error) {
   
  }
};



const editCategory = async (req, res) => {
  const categoryId = req.query.id;
  const name = req.body.name;
  const image = req.files ? req.files.images : null;

  try {
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).render("admin/editCategory", { message: "Category not found" });
    }

    if (image) {
      const imageUrl = await imageUpload(image);
      existingCategory.images = imageUrl;
    }

    existingCategory.name = name;
    await existingCategory.save();

    return res.redirect("/admin/category");
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    return res.status(500).render("admin/editCategory", { message: "Error occurred while editing category" });
  }
};



  module.exports={
    loadCategory,
    loadAddCategory,
    addCategory,
    loadEditCategory,
    editCategory,

  }