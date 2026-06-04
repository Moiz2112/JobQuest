import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['student', 'recruiter'] } })
            .select('fullname email phoneNumber role profile banned createdAt')
            .lean();

        return res.status(200).json({
            success: true,
            users,
            total: users.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching users",
            success: false,
            error: error.message
        });
    }
};

// Ban a user
export const banUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { banned: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User banned successfully",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error banning user",
            success: false,
            error: error.message
        });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('company', 'name logo location industry')
            .populate('created_by', 'fullname email profile.profilePhoto')
            .select('title description position company salary jobType workMode category experienceLevel created_by isActive createdAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs,
            total: jobs.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching jobs",
            success: false,
            error: error.message
        });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job deleted successfully",
            success: true,
            job
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting job",
            success: false,
            error: error.message
        });
    }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('userId', 'fullname email profile.profilePhoto')
            .select('name location website description logo industry status jobsCount applicantsCount userId createdAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            companies,
            total: companies.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching companies",
            success: false,
            error: error.message
        });
    }
};

// Approve a company
export const approveCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findByIdAndUpdate(
            companyId,
            { status: 'approved' },
            { new: true }
        ).populate('userId', 'fullname email');

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company approved successfully",
            success: true,
            company
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error approving company",
            success: false,
            error: error.message
        });
    }
};

// Reject a company
export const rejectCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findByIdAndUpdate(
            companyId,
            { status: 'rejected' },
            { new: true }
        ).populate('userId', 'fullname email');

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company rejected successfully",
            success: true,
            company
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error rejecting company",
            success: false,
            error: error.message
        });
    }
};

// Get all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: 'job',
                select: 'title position company',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .populate('applicant', 'fullname email phoneNumber profile')
            .select('job applicant status createdAt resume coverLetter notes interviewDetails')
            .lean();

        return res.status(200).json({
            success: true,
            applications,
            total: applications.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching applications",
            success: false,
            error: error.message
        });
    }
};

// Update any job as platform admin
export const updateAdminJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            workMode,
            experienceLevel,
            category,
            industry,
            skills,
            position,
            isActive
        } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (requirements !== undefined) job.requirements = typeof requirements === "string"
            ? requirements.split(",").map((item) => item.trim()).filter(Boolean)
            : requirements;
        if (salary !== undefined) job.salary = salary;
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (workMode !== undefined) job.workMode = workMode;
        if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
        if (category !== undefined) job.category = category;
        if (industry !== undefined) job.industry = industry;
        if (skills !== undefined) job.skills = typeof skills === "string"
            ? skills.split(",").map((item) => item.trim()).filter(Boolean)
            : skills;
        if (position !== undefined) job.position = Number(position);
        if (isActive !== undefined) job.isActive = Boolean(isActive);

        await job.save();

        const updatedJob = await Job.findById(jobId)
            .populate('company', 'name logo location industry')
            .populate('created_by', 'fullname email profile.profilePhoto');

        return res.status(200).json({
            message: "Job updated successfully",
            success: true,
            job: updatedJob
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating job",
            success: false,
            error: error.message
        });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $in: ['student', 'recruiter'] } });
        const totalJobs = await Job.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();
        const jobSeekers = await User.countDocuments({ role: 'student' });
        const recruiters = await User.countDocuments({ role: 'recruiter' });
        const pendingCompanies = await Company.countDocuments({ status: 'pending' });

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalJobs,
                totalCompanies,
                totalApplications,
                jobSeekers,
                recruiters,
                pendingCompanies
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching dashboard stats",
            success: false,
            error: error.message
        });
    }
};
