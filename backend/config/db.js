import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect("mongodb+srv://charan03:030904@clusterecoverse.xxoya0d.mongodb.net/ecoverse")
    }catch(error){
    }
}

export default connectDB;
