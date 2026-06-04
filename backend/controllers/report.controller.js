import { Report } from '../models/report.model.js';

// Create a report (could be used by frontend users)
export const createReport = async (req, res) => {
    try {
        const payload = req.body;
        const report = await Report.create(payload);
        return res.status(201).json({ success: true, report });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error creating report', error: error.message });
    }
};

// Get all reports
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({ success: true, reports, total: reports.length });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching reports', error: error.message });
    }
};

// Get a single report
export const getReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id).lean();
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        return res.status(200).json({ success: true, report });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching report', error: error.message });
    }
};

// Mark a report as resolved
export const resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndUpdate(id, { status: 'resolved' }, { new: true }).lean();
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        return res.status(200).json({ success: true, report });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error updating report', error: error.message });
    }
};
