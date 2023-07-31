const isLogin = (req, res, next)=>{
    try {
        if(req.session.admin_id){
            next();
        }else{
            res.redirect("/")
        }

    } catch (error) {
        console.log(error);
    }
}

const isLogout = (req, res, next)=>{
    try {
        if(req.session.admin_id){
            res.redirect("/admin");
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    isLogin,
    isLogout,
}