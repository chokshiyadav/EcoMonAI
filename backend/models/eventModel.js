import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    users:[{
        type:mongoose.Schema.Types.Mixed,
        ref:'users'
    },],
    organiser:{
        type:mongoose.ObjectId,
        ref:'users',
        required:true
    }
},{timestamps:true});

export default mongoose.model('event',eventSchema)