const User = require('../models/userschema');


const isLogin = (req, res, next) => {
  try {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      const user = await User.findById(userId);
      if (user && user.access) {
        next();
      } else {
        req.session.user_id=null 
        res.redirect("/?access=false")    
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

module.exports = {
  isLogin,
  isLogout,
};
