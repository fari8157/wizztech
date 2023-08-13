
const User = require('../../models/userschema');
const addressModel = require('../../models/adress');






  const loadAddress = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user_id });
        const contact = await addressModel.findOne({ user: req.session.user_id, type: "contact" });
        const main = await addressModel.findOne({ user: req.session.user_id, type: "main" });
        const secondary = await addressModel.find({ user: req.session.user_id, type: "secondary" });
       
        res.render('user/address', { contact, main, secondary,user });
    } catch (error) {
        console.error('Error loading address page:', error);
        res.status(500).send('Server Error');
    }
};



const loadAddnewAddress = async (req, res) => {
    try {
        const user = await User.findOne({ _id:  req.session.user_id });
        const type = req.query.type;
        res.render('user/addadress', { type ,user});
    } catch (error) {
        console.error('Error loading add new address page:', error);
        res.status(500).send('Server Error');
    }
};

const addNewAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const {
            building,
            street,
            city,
            state,
            country,
            type,
        } = req.body;

        const zipcode = parseInt(req.body.zipcode);
        const phone = parseInt(req.body.phone);

        const newAddress = new addressModel({
            buildingName: building,
            street,
            city,
            state,
            zipCode: zipcode,
            country,
            phoneNumber: phone,
            type,
            user: userId
        });

        await newAddress.save();
        res.redirect('/addAddress');
    } catch (error) {
        console.error('Error adding new address:', error);
        res.status(500).send('Server Error');
    }
};

const loadEditAddress = async (req, res)=>{
    const { type, id} = req.query;
    const address = await addressModel.findOne({_id: id});
    res.render("user/editAddress",{type, address});
}


const editAddress = async (req, res)=>{

    try {

        const addressId = req.query.addressId;

        const { 
            buildingName,
            street, 
            city,
            state,
            country,
        } = req.body;

        let pincode = parseInt(req.body.pincode);
        let phonenumber = parseInt(req.body.number);

        await addressModel.findByIdAndUpdate(addressId, {
            buildingName,
            street,
            city,
            state,
            zipCode:pincode,
            country,
            phoneNumber:phonenumber,
        })

        res.redirect('/addAddress');
        
    } catch (error) {
        console.log(error);
    }
    
}

const deleteAddress = async (req, res)=>{
    try {

        const id = req.query.id;
        await addressModel.deleteOne({_id: id});
        res.json({response: true});

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loadAddress,
    loadAddnewAddress,
    addNewAddress,
    deleteAddress,
    editAddress,
    loadEditAddress
  
}
