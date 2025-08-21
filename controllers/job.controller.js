import Job from "../models/job.model.js"
import mongoose from "mongoose";
//admin post the job
export const postJob = async(req,res)=>{
    try{
        const{title,description,requirements,salary,location,jobType,experience,position,companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId
        })
        return res.status(201).json({
            message:"New job created successfully.",
            job,
            success:true
        })
    }
    // catch(error){
    //     console.log(error);
        
    // }
    catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Internal server error",
        error: error.message,
        success: false
    });
}
}

export const getAllJobs = async(req,res)=>{
    try{
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword , $options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1})
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            success:true,
            jobs
        })
    }
    catch(error){
        console.log(error);
        
    }
}
//student
export const getJobById = async(req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ // it will check the user has applied for the job or not by matching the id of applicant
             path:"applications"
        })
         if(!job){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({ // if job found
            job,
            success:true
        })
    }
    catch(error){
        console.log(error);
        
    }
}





//how much job has been created ny admin

export const getAdminJobs = async(req,res)=>{
    try{
     //   const adminId = req.id;
     //   const jobs = await Job.find({created_by:adminId});

         const adminId = new mongoose.Types.ObjectId(req.id); // FIXED

     const jobs = await Job.find({created_by:adminId}).populate({
         path:'company',
         createdAt:-1
     })
         if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        console.log("Admin ID (req.id):", req.id);
  
         return res.status(200).json({ // if job found
            jobs,
            success:true
         })
    }
    catch(error){
        console.log(error);
        
    }
    console.log("Admin ID (req.id):", req.id);

}




export const bookmarkJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const user = await Job.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyBookmarked = user.bookmarks.includes(jobId);

    if (alreadyBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== jobId);
    } else {
      // Add bookmark
      user.bookmarks.push(jobId);
    }

    await user.save();

    res.status(200).json({ 
      message: alreadyBookmarked ? "Bookmark removed" : "Job bookmarked",
      bookmark: !alreadyBookmarked 
    });
  } catch (err) {
    console.error("Bookmark Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
