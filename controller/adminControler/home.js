const  orderModel=require("../../models/order")
const userModel=require("../../models/userschema")
const Category=require("../../models/category")
const adminHome=async(req,res)=>{
    try {

        let filterValue = 30;
        if(req.query.filter1){
            filterValue = parseInt(req.query.filter1);
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - filterValue);

        const daily = await orderModel.aggregate([
            {
                $match: {
                    order_date: {
                        $gte: startDate,
                        $lt: endDate,
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$order_date"
                        }
                    },
                    count: {$sum: 1},
                }
            },
            {
                $sort: {_id: 1}
            }
        ]);
        const user = await userModel.aggregate([
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$created"
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { _id: 1 }
            }
          ])
          const category = await orderModel.aggregate([
            {
              $lookup: {
                from: "orderitems",
                localField: "items",
                foreignField: "_id",
                as: "orderData"
              }

            },
            {
              
              $unwind: "$orderData"
            },
           
           {
            $lookup:{
                from:"products",
                localField:"orderData.product",
                foreignField:"_id",
                as:"productdata",
            }
           },
           {
            $unwind:"$productdata"
           },
           {
            $group:{
                _id: "$productdata.category",
                count: {$sum: 1}
            }
           }
            
          ]);
        //   const cat = []
        //   for(id of category){
        //     //   let val= JSON.parse(JSON.stringify(
        //     //       await Category.findById(id._id,{name:1})
        //     //   ))
        //     //   val.count=id.count;
        //     //   cat.push(val)
        //     console.log(id);
        //   }
        
          
          console.log(category)
  
          const orders = await orderModel.find()
                            .populate("user")
                            .sort({order_date: -1})
                            .limit(5);



        const orderCount = await orderModel.countDocuments();
        const userCount = await userModel.countDocuments();

        res.render('admin/dashboad',{daily, orderCount, userCount,user,orders,category});
    } catch (error) {
        console.log(error);
    }
}

  //sales report
  const report = async (req, res, next) => {
    try {
        let yearly = await orderModel.aggregate([
            {
                $match: { order_status: { $eq: "delivered" } },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$delivery_date" },
                    },
                    items: { $sum: { $size: "$items" } },
                    total: { $sum: "$total" },
                    count: { $sum: 1 },
                },
            },
        ]);
        res.render("admin/sales", { yearly ,url:'dashboard'});
    } catch (error) {
        console.log(error);
        next(error);
    }
  };





module.exports={
    adminHome
}


