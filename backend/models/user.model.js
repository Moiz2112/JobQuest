import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter','admin'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        },
        headline: {type: String},
        education: [
            {
                school: String,
                degree: String,
                fieldOfStudy: String,
                startDate: Date,
                endDate: Date,
                current: Boolean,
                description: String
            }
        ],
        experience: [
            {
                title: String,
                company: String,
                location: String,
                startDate: Date,
                endDate: Date,
                current: Boolean,
                description: String
            }
        ]
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    preferences: {
        jobTypes: [String],
        workMode: [String], // Remote, Hybrid, Onsite
        locations: [String],
        industries: [String],
        minSalary: Number,
        maxSalary: Number
    },
    banned: {
        type: Boolean,
        default: false
    }
},{timestamps:true});
export const User = mongoose.model('User', userSchema);