import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { sendEmail, emailTemplates } from "../utils/emailService.js";

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const { resume, coverLetter } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };

        // Check if user already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId).populate('company').populate('created_by');
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        // Get user info
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            resume: resume || user.profile.resume,
            coverLetter: coverLetter || ""
        });

        // Update job applications array and count
        job.applications.push(newApplication._id);
        job.applicationCount = (job.applicationCount || 0) + 1;
        await job.save();

        // Update user applied jobs
        user.appliedJobs.push(jobId);
        await user.save();

        // Update company applicants count
        await Company.findByIdAndUpdate(job.company._id, { $inc: { applicantsCount: 1 } });

        // Send confirmation email
        try {
            const template = emailTemplates.applicationConfirmation(
                user.fullname,
                job.company.name,
                job.title,
                new Date(newApplication.createdAt).toLocaleDateString()
            );
            await sendEmail(user.email, template);
        } catch (emailError) {
            console.log("Email sending failed (non-critical):", emailError);
        }

        return res.status(201).json({
            message: "Job applied successfully.",
            application: newApplication,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error applying for job",
            success: false,
            error: error.message
        });
    }
};

// Get applied jobs for student
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        if (!applications || applications.length === 0) {
            return res.status(200).json({
                message: "No applications found",
                applications: [],
                success: true
            })
        };

        return res.status(200).json({
            applications,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving applications",
            success: false,
            error: error.message
        });
    }
}

// Get applicants for a job (Recruiter)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        }

        // Check authorization
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to view applicants.",
                success: false
            })
        }

        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'applicant',
                select: 'fullname email profile phoneNumber'
            });

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving applicants",
            success: false,
            error: error.message
        });
    }
}

// Update application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const userId = req.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            })
        };

        const application = await Application.findById(applicationId).populate('job').populate('applicant');
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // Check authorization
        const job = await Job.findById(application.job._id);
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this application.",
                success: false
            })
        }

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        // Send status update email
        try {
            const template = emailTemplates.applicationStatusUpdate(
                application.applicant.fullname,
                job.company.toString() || 'Company',
                job.title,
                status
            );
            await sendEmail(application.applicant.email, template);
        } catch (emailError) {
            console.log("Email sending failed (non-critical):", emailError);
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating status",
            success: false,
            error: error.message
        });
    }
}

// Schedule interview
export const scheduleInterview = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;
        const { interviewDate, interviewTime, interviewMode, meetingLink, instructions } = req.body;

        if (!interviewDate || !interviewTime || !interviewMode) {
            return res.status(400).json({
                message: "Missing required interview details",
                success: false
            })
        }

        const application = await Application.findById(applicationId).populate('job').populate('applicant');
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        }

        // Check authorization
        const job = await Job.findById(application.job._id);
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to schedule interviews.",
                success: false
            })
        }

        // Update interview details
        application.interviewDetails = {
            date: interviewDate,
            time: interviewTime,
            mode: interviewMode,
            meetingLink: meetingLink || null,
            instructions: instructions || null
        };
        application.status = 'interview_scheduled';
        await application.save();

        // Send interview email
        try {
            const company = await Company.findById(job.company);
            const template = emailTemplates.interviewInvitation(
                application.applicant.fullname,
                company.name,
                job.title,
                interviewDate,
                interviewTime,
                interviewMode,
                meetingLink,
                instructions
            );
            await sendEmail(application.applicant.email, template);
        } catch (emailError) {
            console.log("Email sending failed (non-critical):", emailError);
        }

        return res.status(200).json({
            message: "Interview scheduled successfully.",
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error scheduling interview",
            success: false,
            error: error.message
        });
    }
}

// Get application by ID
export const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId)
            .populate('job')
            .populate('applicant');

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        }

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving application",
            success: false,
            error: error.message
        });
    }
}