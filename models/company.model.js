import mongoose from "mongoose";

const companySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
     description:{
        type:String,
    },
     website:{
        type:String,
    },
     location:{
        type:String,
    },
   logo:{
        type:String,//url company logo
    },
     userId:{
     type:mongoose.Schema.Types.ObjectId, // person who created the company
     ref:'User',
     required:true
    },
},{timestamps:true})

const Company = mongoose.model("Company",companySchema)
export default Company