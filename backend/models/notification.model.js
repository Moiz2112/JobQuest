import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['application_received', 'application_status_changed', 'job_recommended', 'interview_scheduled', 'message'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        jobId: mongoose.Schema.Types.ObjectId,
        applicationId: mongoose.Schema.Types.ObjectId,
        senderId: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: String
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
