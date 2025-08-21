import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import companyRoutes from "./routes/company.route.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"

dotenv.config({})
const app = express();

//middleware
app.use(express.json());//to send the data in json form
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))

//apis
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes);




// "http://localhost:8000/api/v1/register"
// "http://localhost:8000/api/v1/register"
// "http://localhost:8000/api/v1/register"

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running ar port ${PORT}`);
})