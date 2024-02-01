const mongoose=require("mongoose");

const DB="mongodb+srv://sohailshaikh17095:helloworld@cluster0.cwmtc3r.mongodb.net/"
mongoose.connect(DB).then(()=>{
    console.log("mongoose Connection is successfull");
}).catch(()=>
{
    console.log("mongoose connection failed")
})