require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const { randomUUID } = require('crypto');


const imageUpload = async (file)=>{
    try{
        if (!file || !file.mimetype.startsWith('image/')) {
            throw new Error('Invalid file type. Only images are allowed.');
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            public_id: `${randomUUID()}`,
            resource_type: "auto",
            folder: "WIZZ_TECH",
            transformation: [
                { width: 679, height: 679, crop: "fit", quality: 80 }
            ]
        })

        const myResultObj = {
            public_id: result.public_id,
            url: result.url,
        }
        
        return myResultObj;

    }catch(err){
        console.log(err);
    }
}



const multipleImage = async (files)=>{

    try{
    
        let imageUrlList = [];

        if(Array.isArray(files)){

            for(let i=0;i<files.length;i++){
                const file = files[i];
    
                const result = await imageUpload(file);
                imageUrlList.push(result);
            }

        }else{

            const result = await imageUpload(files);
            imageUrlList.push(result);

        }
        

        return imageUrlList;

    }catch(err){
        console.log(err);
    }
}



module.exports = {
    multipleImage,
    imageUpload,
};