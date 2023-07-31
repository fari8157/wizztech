require('dotenv').config()
const express=require("express")
const user_routers=require('./routers/user')
const admin_routers=require('./routers/admin')
const nocache =require('nocache');
const cloudinary=require("cloudinary").v2
const fileupload=require("express-fileupload")


const app=express()
// const path=require('path')
const mongoose = require("mongoose");
const session = require('express-session')
const cookieParser = require('cookie-parser');
app.use(cookieParser());


mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


  cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

  })

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.set("view engine",'ejs')

  app.use(express.static("public"))
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    
  }));
  app.use(fileupload({
    useTempFiles: true,
    limits: {fileSize: 50 * 2024 * 1024}
  }))
  app.set("layout", "layouts/layout");
  app.use(nocache())
  app.use('/',user_routers)
  app.use("/admin",admin_routers)
 
  

  
  app.listen(3000,()=>{
      console.log("server running");
  })