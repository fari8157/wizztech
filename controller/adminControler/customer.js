const User = require("../../models/userschema")

const userTable = async (req, res) => {
  try {
    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    console.log(search)
    const userDetails = await User.find({
      isAdmin: false,
      $or: [

        { fullname: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } }
      ]
    });


    res.render('admin/customer', { user: userDetails });

  } catch (error) {
    console.error(error.message);
  }
}
const loadEditUser = async (req, res) => {
  try {
    const id = req.query.id
    console.log(id);
    const userDetails = await User.findById({ _id: id })
    if (userDetails) {
      res.render('admin/editCustomer', { user: userDetails })
    }
    // else{
    //  res.redirect('/admin/home')
    //  }

  } catch (error) {
    console.log(error);

  }

}
const updateUser = async (req,res)=>{
  try {
      let access = req.body.access;
      const id = req.query.id
      await User.findByIdAndUpdate(id,{$set:{access:access}})
      res.redirect('/admin/customer')
  } catch (error) {
      console.log(error);
    }
}



module.exports = { userTable, loadEditUser,  updateUser }