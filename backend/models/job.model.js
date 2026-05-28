import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'PKR'
        }
    },
    experienceLevel:{
        type:String,
        enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
        required:true,
    },
    location: {
        type: String,
        enum: ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'],
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true
    },
    workMode: {
        type: String,
        enum: ['Remote', 'Hybrid', 'Onsite'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
        default: 1
    },
    skills: [{
        type: String
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    applicationCount: {
        type: Number,
        default: 0
    }
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);