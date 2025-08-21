import Application from "../models/application.model.js";
import Job from "../models/job.model.js"

export const applyJob = async(req,res)=>{
    try{
        const userId = req.id;
        const jobId = req.params.id;

        if(!jobId){
            return res.status(400).json({
                message:"Job id is required",
                success:false
            })
        };

        //check if user is already applied for this job
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});

        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false
            })
        }
        //check if the job exist
        const job = await Job.findById(jobId)
        
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }
        //create new applicaiton
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        })
        
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied Successfully",
            success:true
        })
    }
    catch(error){
        console.log(error);
        
    }
}




export const getAppliedJobs = async(req,res)=>{
    try{
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                 path:'company',
                 options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No applications",
                success:false
            })
        }
        return res.status(200).json({
            application,
            success:true
        })
        }
    catch(error){
        console.log(error);
        
    }
}


//admin will se how many user have apply for the job

// export const getApplicants = async(req,res)=>{
//     try{
//         const jobId = req.params.id;
//         console.log("📩 Get Applicants API called for job:", jobId);

//         const job = await Job.findById(jobId).populate({
//              path:'applications',
//             options:{sort:{createdAt:-1}},
//             populate:{
//                 path:'applicant'
//             }
//         })
//         console.log("Job", job)

//         if(!job){
//             return res.status(404).json({
//                 message:"Job not found",
//                 success:false
//             })
//         }
//                 // Now manually populate applications from the Application model
//  const applications = await Application.find({job:jobId})
//  .sort({createdAt:-1})
//  .populate('applicant')
//  console.log("Application fetched:",applications.length);
 
//         return res.status(200).json({
//             job,
//             success:true
//         })
        
//     }
//     catch(error){
//         console.log(error);
        
//     }
// }


export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log("📩 Get Applicants API called for job:", jobId);

        // Ensure job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Now manually populate applications from the Application model
        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate('applicant');
 
        console.log("✅ Applications fetched:", applications.length);

        return res.status(200).json({
            job,
            applications,
            success: true
        });

    } catch (error) {
        console.log("❌ Error in getApplicants:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updataStatus = async(req,res)=>{
    try{
        // const status = req.body;
        // const applicantId = req.body.params;

        const {status,applicantId} = req.body
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        }

        //find the application by application id
        const application = await Application.findOne({_id:applicantId});
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        }

        //update the status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"Status updated succesfsully",
            success:true
        })
    }
    catch(error){
        console.log(error);
        
    }
}



// import Application from "../models/application.model.js";
// import Job from "../models/job.model.js";

// // =============================
// // Apply to a Job
// // =============================
// export const applyJob = async (req, res) => {
//     try {
//         const userId = req.id;
//         const jobId = req.params.id;

//         console.log("Apply Job API called with:", { userId, jobId });

//         if (!jobId) {
//             return res.status(400).json({
//                 message: "Job id is required",
//                 success: false
//             });
//         }

//         const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
//         console.log("Existing Application:", existingApplication);

//         if (existingApplication) {
//             return res.status(400).json({
//                 message: "You have already applied for this job",
//                 success: false
//             });
//         }

//         const job = await Job.findById(jobId);
//         console.log("Job fetched:", job);

//         if (!job) {
//             return res.status(404).json({
//                 message: "Job not found",
//                 success: false
//             });
//         }

//         const newApplication = await Application.create({
//             job: jobId,
//             applicant: userId,
//         });

//         console.log("New Application created:", newApplication);

//         job.applications.push(newApplication._id);
//         await job.save();
//         console.log("Job updated with new application");

//         return res.status(201).json({
//             message: "Job applied successfully",
//             success: true
//         });
//     } catch (error) {
//         console.log("❌ Error in applyJob:", error);
//         return res.status(500).json({ message: "Server error", success: false });
//     }
// };


// // =============================
// // Get Applied Jobs for a User
// // =============================
// export const getAppliedJobs = async (req, res) => {
//     try {
//         const userId = req.id;
//         console.log("Get Applied Jobs called for user:", userId);

//         const application = await Application.find({ applicant: userId })
//             .sort({ createdAt: -1 })
//             .populate({
//                 path: 'job',
//                 options: { sort: { createdAt: -1 } },
//                 populate: {
//                     path: 'company',
//                     options: { sort: { createdAt: -1 } },
//                 }
//             });

//         console.log("Applications found:", application);

//         if (!application || application.length === 0) {
//             return res.status(404).json({
//                 message: "No applications found",
//                 success: false
//             });
//         }

//         return res.status(200).json({
//             application,
//             success: true
//         });
//     } catch (error) {
//         console.log("❌ Error in getAppliedJobs:", error);
//         return res.status(500).json({ message: "Server error", success: false });
//     }
// };


// // =============================
// // Get Applicants for a Job (Admin)
// // =============================
// // export const getApplicants = async (req, res) => {
// //     try {
// //         const jobId = req.params.id;
// //         console.log("Get Applicants API called for job:", jobId);

// //         const job = await Job.findById(jobId)
// //             .populate({
// //                 path: 'applications',
// //                 options: { sort: { createdAt: -1 } },
// //                 populate: {
// //                     path: 'applicant'
// //                 }
// //             });

// //         console.log("Populated Job with applications:", job);

// //         if (!job) {
// //             return res.status(404).json({
// //                 message: "Job not found",
// //                 success: false
// //             });
// //         }

// //         return res.status(200).json({
// //             job,
// //             success: true
// //         });

// //     } catch (error) {
// //         console.log("❌ Error in getApplicants:", error);
// //         return res.status(500).json({ message: "Server error", success: false });
// //     }
// // };

// export const getApplicants = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         console.log("📩 Get Applicants API called for job:", jobId);

//         // Ensure job exists
//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({
//                 message: "Job not found",
//                 success: false
//             });
//         }

//         // Now manually populate applications from the Application model
//         const applications = await Application.find({ job: jobId })
//             .sort({ createdAt: -1 })
//             .populate('applicant');

//         console.log("✅ Applications fetched:", applications.length);

//         return res.status(200).json({
//             job,
//             applications,
//             success: true
//         });

//     } catch (error) {
//         console.log("❌ Error in getApplicants:", error);
//         return res.status(500).json({ message: "Server error", success: false });
//     }
// };
// // =============================
// // Update Application Status (Admin)
// // =============================
// export const updataStatus = async (req, res) => {
//     try {
//         const { status, applicantId } = req.body;
//         console.log("Update status called with:", { status, applicantId });

//         if (!status) {
//             return res.status(400).json({
//                 message: "Status is required",
//                 success: false
//             });
//         }

//         const application = await Application.findById(applicantId);
//         console.log("Application to update:", application);

//         if (!application) {
//             return res.status(404).json({
//                 message: "Application not found",
//                 success: false
//             });
//         }

//         application.status = status.toLowerCase();
//         await application.save();
//         console.log("Application status updated");

//         return res.status(200).json({
//             message: "Status updated successfully",
//             success: true
//         });

//     } catch (error) {
//         console.log("❌ Error in updataStatus:", error);
//         return res.status(500).json({ message: "Server error", success: false });
//     }
// };
