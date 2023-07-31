

const adminlogout = async (req, res) => {
    try {
        req.session.admin_id = null
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    adminlogout,
}