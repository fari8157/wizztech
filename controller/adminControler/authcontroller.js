
 const User=require("../../models/userschema")
 const bcrypt = require('bcrypt');

const loadlogin = async (req, res) => {
    try {
        if(req.session.admin_id){
            res.redirect("/admin")
        }
        else{
            res.render('admin/login',{message:null})
        }
        
    } catch (error) {
        
    }
}

const verify = async (req, res) => {
    try {
        const email= req.body.email;
        const password = req.body.password
        const userdata = await User.findOne({ email: email })

        if (userdata) {
            const passwordMatch = await bcrypt.compare(password, userdata.password)

            if (passwordMatch) {
                if (!userdata.isAdmin) {
                    res.render('admin/login', { message: "incorrect email and password admin" })
                } else {

                    req.session.admin_id = userdata._id
                    res.redirect("/admin")
                }
            } else {
                res.render('admin/login', { message: "incorrect email and password admin" })
            }
        } else {
            res.render('admin/login', { message: "incorrect email and password admin " })
        }

    } catch (error) {
        
    }
}

module.exports={
    loadlogin,
    verify
}