const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },name:{
        type:String,
        require:true
    },phone:{
        type:String,
        require:true
    },email1:{
        type:String,
        require:true
    },email2:{
        type:String,
        require:true
    }
    
})

const Users=mongoose.model("Users",userSchema)
module.exports={Users}