import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    status:{
        type:String,
        enum:['pending', 'reviewed', 'shortlisted', 'interview_scheduled', 'rejected', 'accepted'],
        default:'pending'
    },
    interviewDetails: {
        date: Date,
        time: String,
        mode: {
            type: String,
            enum: ['In-person', 'Virtual', 'Phone']
        },
        meetingLink: String,
        instructions: String
    },
    notes: {
        type: String
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);