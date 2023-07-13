const app=require("./app");
const dotenv=require("dotenv");
const cloudinary=require("cloudinary");
const connectdatabase=require("./config/database");


//config
dotenv.config({path:'config/config.env'});
//connecting database

connectdatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.port}`);
});

//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled error`);
    server.close(()=>{
process.exit(1);
    })
})