import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String,
        enum: ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'],
        required: true
    },
    logo:{
        type:String // URL to company logo
    },
    industry: {
        type: String
    },
    companySize: {
        type: String,
        enum: ['1-50', '51-200', '201-500', '501-1000', '1000+']
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    jobsCount: {
        type: Number,
        default: 0
    },
    applicantsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
},{timestamps:true})
export const Company = mongoose.model("Company", companySchema);