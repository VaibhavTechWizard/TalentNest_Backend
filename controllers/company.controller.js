import Company from "../models/company.model.js";
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

export const registerCompany = async(req,res)=>{
    try{
        const {companyName} = req.body
        if(!companyName){
            return res.status(400).json({
                message:"Company name is required.",
                success:false
            })
        }
        let company = await Company.findOne({name:companyName})
        if(company){
           return res.status(400).json({
                message:"You can't register same company",
                success:false
            })
        }
        company= await Company.create({
            name:companyName,
            userId:req.id
        })
        return res.status(200).json({
            message:"Company registered succesfully.",
            company,
            success:true
        })
    }catch(error){
        console.log(error);
        
    }
}

export const getCompany =  async(req,res)=>{
    try{
        const userId = req.id; // logged in userId
        const companies = await Company.find({userId})
        if(!companies){
            return res.status(400).json({
                message:"Companies not found",
                success:false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    }catch(error){
        console.log(error);
        
    }
}

//get company id
export const getCompanyId = async (req,res)=>{
    try{
       const companyId = req.params.id;
       const company = await Company.findById(companyId)
       if(!company){
        return res.status(401).json({
              message:"Company not found",
                success:false
        })
       } 
       return res.status(200).json({
        company,
        success:true
       })
    }catch(error){
        console.log(error);
        
    }
}

export const updateCompany=async (req,res)=>{
    try{
        const {name,description,website,location} = req.body;
        
        console.log(name,description,website,location);
        
        const file = req.file;

        //cloudany aayega
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content) // it will upload the file to cloudinary
    const logo = cloudResponse.secure_url;//u will get the logo from here
   
        const updateData = {name,description,website,location,logo};
        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true})

        if(!company){
            return res.status(400).json({
                message:"Company Not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Company information"
            ,success:true
        })
    }catch(error){
        console.log(error);
        
    }
}