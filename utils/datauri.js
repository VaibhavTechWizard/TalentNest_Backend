 //it will generate data uri
 import DataUriParser from "datauri/parser.js"

 import path from "path";


 const getDataUri = (file) =>{
    if(!file || !file.originalname || !file.buffer){
    console.error("❌ getDataUri received invalid file:", file);
    return null;
 // or throw new Error("File not provided");
 }
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();

    return parser.format(extName,file.buffer);
 }
 export default getDataUri;