const User = require("../../models/userschema");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mail = require("../../utility/sendEmail");
const { generateOTP, sendOTP } = require('../../utility/sendEmail');


const loadRegister = async (req, res) => {
  try {
    res.render('user/signup', { message: null });
  } catch (err) {
    console.log(err.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ fullname: fullname });
    if (userData) {
      const message = "User already exists";
      res.render('user/signup', { message: message });
    } else {
      const spass = await securePassword(req.body.password);
      const newUser = new User({
        fullname: fullname,
        email: email,
        password: spass
      });

      const userData = await newUser.save();
      
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};

// const successEmail = async (req, res) => {
//   res.render("user/successEmail", { message: req.params.fullname });
//   const fullname = req.params.fullname;
//   await User.findOneAndUpdate({ fullname: fullname }, { $set: { isverified: true } });
// };

// const verifyEmail = async (req, res) => {
//   res.render("user/verifyEmail");
// };


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};

const loginLoad = async (req, res) => {
 
  let login_message;
  res.render('user/login', { message: login_message });
  login_message = null;
};

const verifyLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userData = await User.findOne({ email: email });

  if (userData) {
    const passMatch = await bcrypt.compare(password, userData.password);
    if (passMatch) {

        if(userData.isAdmin){
          req.session.admin_id = userData._id;
          res.redirect('/admin');
        }else{

          
            if (userData.access) {
            // Generate and send OTP
            const otp = generateOTP();
            console.log(otp);
            try {
              await sendOTP(userData.email, otp);
              // Store the OTP in a cookie
              const hotp = await securePassword(otp);
              const Otp = {
                userID: userData._id,
                otp: hotp,
              };
              res.cookie('otp', Otp, { maxAge: 600000, httpOnly: true }); // Set an appropriate expiration time
              res.redirect('/login/otp');
            } catch (error) {
              console.error('Error sending OTP:', error);
              res.render('user/login', { message: "Error sending OTP. Please try again later." });
            }
          } else {
            res.render('user/login', { message: "Access denied" });
          }
        
        }
      } else {
        res.render('user/login', { message: "Username or password is incorrect" });
      }
    } else {
      res.render('user/login', { message: "User not found" });
    }
};

const loadotp = async (req, res) => {
  res.render("user/otpverification", { message: null, localaction: "/login/otp" });
};

const otpVerify = async (req, res) => {
  const enteredOTP = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
  const Otp = req.cookies.otp;
  const otp = Otp.otp;
  const otpMatch = await bcrypt.compare(enteredOTP, otp);
  if (otpMatch) {
    req.session.user_id = Otp.userID;
    // const userData= await User.findOne({username:username})
    // req.session.user_id=userData._id
    // OTP verified, create session or perform further actions
    res.clearCookie('otp'); // Clear the OTP cookie after successful verification if needed

    res.redirect('/'); // Change the route to your home page route
    message = null;
  } else {
    res.render('user/otpverification', { message: "Incorrect OTP. Please try again.", localaction: "/login/otp" });
  }
};

const loadForgetpass = async (req, res) => {
  res.render('user/forgetPass');
};

const loadForgetOtp = async (req, res) => {
  res.render("user/otpverification", { message: null, localaction: "/forget/otp" });
};

const forgetPass = async (req, res) => {
  const email = req.body.email;
  const userData = await User.findOne({ email: email });
  console.log(userData);
  if (userData) {
    const otp = generateOTP();
    try {
      await sendOTP(userData.email, otp);
      // Store the OTP in a cookie
      const hashOtp = await securePassword(otp);
      const Otp = {
        userID: userData._id,
        otp: hashOtp,
      };
      res.cookie('otp', Otp, { maxAge: 600000, httpOnly: true }); // Set an appropriate expiration time
      res.redirect("/forget/otp");
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.render('user/forgetPass', { message: "Error sending OTP. Please try again later." });
    }
  }
};

const forgetOtp = async (req, res) => {
  const enteredOTP = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
  const Otp = req.cookies.otp;
  const otp = Otp.otp;
  const otpMatch = await bcrypt.compare(enteredOTP, otp);
  if (otpMatch) {
    res.render('user/conformPass', { localaction: "/forget/otp" });
  }
};

const updatePassword = async (req, res) => {
  console.log(req.cookies.otp);
  const Otp = req.cookies.otp;
  console.log(Otp);
  const userId = Otp.userID;
  const password = req.body.password;
  const spass = await securePassword(password);
  const result = await User.updateOne(
    { _id: userId },
    { $set: { password: spass } }
    );
    console.log(result);
  res.redirect("/login");
};
module.exports = {
  loadRegister,
  insertUser,
  securePassword,
  // verifyEmail,
  loginLoad,
  // successEmail,
  verifyLogin,
  loadotp,
  otpVerify,
  loadForgetpass,
  forgetPass,
  loadForgetOtp,
  forgetOtp,
  updatePassword
};
