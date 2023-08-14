

const adminlogout = async (req, res) => {
    try {
        req.session.admin_id = null
        res.redirect('/admin')
    } catch (error) {
       
    }
}

module.exports={
    adminlogout,
}