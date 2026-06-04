import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    severity: { type: String, enum: ['low','medium','high','critical'], default: 'low' },
    status: { type: String, enum: ['pending','in-review','resolved'], default: 'pending' },
    date: { type: Date, default: Date.now },
    description: { type: String },
    reportedBy: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: String
    }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
