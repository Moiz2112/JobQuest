import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

// Post a new job (Recruiter only)
export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experienceLevel, 
            position, 
            companyId,
            workMode,
            category,
            industry,
            skills
        } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId || !workMode || !category || !industry) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        // Validate salary
        if (!salary.min || !salary.max || salary.min < 0 || salary.max < 0 || salary.min > salary.max) {
            return res.status(400).json({
                message: "Invalid salary range.",
                success: false
            })
        }
        
        // Validate position
        const parsedPosition = Number(position);
        if (isNaN(parsedPosition) || parsedPosition <= 0) {
            return res.status(400).json({
                message: "Position must be a valid positive number.",
                success: false
            })
        }

        // Check if company exists and belongs to user
        const company = await Company.findById(companyId);
        if (!company || company.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to post jobs for this company.",
                success: false
            })
        }
        
        const job = await Job.create({
            title,
            description,
            requirements: typeof requirements === 'string' ? requirements.split(",") : requirements,
            salary: salary,
            location,
            jobType,
            experienceLevel,
            position: parsedPosition,
            workMode,
            category,
            industry,
            skills: typeof skills === 'string' ? skills.split(",") : skills,
            company: companyId,
            created_by: userId
        });

        // Update company jobs count
        await Company.findByIdAndUpdate(companyId, { $inc: { jobsCount: 1 } });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create job.",
            success: false,
            error: error.message
        });
    }
}

// Get all jobs with advanced filtering
export const getAllJobs = async (req, res) => {
    try {
        const { 
            keyword, 
            location, 
            jobType, 
            workMode, 
            experienceLevel, 
            salaryMin, 
            salaryMax,
            category,
            industry,
            page = 1,
            limit = 10
        } = req.query;

        const skip = (page - 1) * limit;
        let query = { isActive: true };

        // Search by keyword
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { skills: { $regex: keyword, $options: "i" } }
            ];
        }

        // Filter by location
        if (location) {
            query.location = location;
        }

        // Filter by job type
        if (jobType) {
            query.jobType = jobType;
        }

        // Filter by work mode
        if (workMode) {
            query.workMode = workMode;
        }

        // Filter by experience level
        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by industry
        if (industry) {
            query.industry = industry;
        }

        // Filter by salary range
        if (salaryMin || salaryMax) {
            query.$and = [];
            if (salaryMin) {
                query.$and.push({ "salary.max": { $gte: Number(salaryMin) } });
            }
            if (salaryMax) {
                query.$and.push({ "salary.min": { $lte: Number(salaryMax) } });
            }
        }

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate({
                path: "company",
                select: "name logo industry location"
            })
            .populate({
                path: "created_by",
                select: "fullname email"
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        return res.status(200).json({
            jobs,
            totalJobs,
            currentPage: Number(page),
            totalPages: Math.ceil(totalJobs / limit),
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving jobs",
            success: false,
            error: error.message
        });
    }
}

// Get job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "company"
            })
            .populate({
                path: "applications"
            })
            .populate({
                path: "created_by",
                select: "fullname email profile"
            });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };

        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving job",
            success: false,
            error: error.message
        });
    }
}

// Get jobs posted by recruiter (Admin dashboard)
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({
                path: 'company'
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: "No jobs posted yet.",
                jobs: [],
                success: true
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving admin jobs",
            success: false,
            error: error.message
        });
    }
}

// Update a job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
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
            position
        } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        }

        // Check authorization
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this job.",
                success: false
            })
        }

        // Update fields
        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) job.requirements = typeof requirements === 'string' ? requirements.split(",") : requirements;
        if (salary) job.salary = salary;
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (workMode) job.workMode = workMode;
        if (experienceLevel) job.experienceLevel = experienceLevel;
        if (category) job.category = category;
        if (industry) job.industry = industry;
        if (skills) job.skills = typeof skills === 'string' ? skills.split(",") : skills;
        if (position) job.position = position;

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating job",
            success: false,
            error: error.message
        });
    }
}

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        }

        // Check authorization
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to delete this job.",
                success: false
            })
        }

        // Delete job and update company count
        await Job.findByIdAndDelete(jobId);
        await Company.findByIdAndUpdate(job.company, { $inc: { jobsCount: -1 } });

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting job",
            success: false,
            error: error.message
        });
    }
}

// Get applicants for a specific job
export const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
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
            .populate({
                path: 'applicant',
                select: 'fullname email profile phoneNumber'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            applications,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving applicants",
            success: false,
            error: error.message
        });
    }
}

// Get featured jobs
export const getFeaturedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true })
            .populate('company')
            .sort({ createdAt: -1 })
            .limit(6);

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving featured jobs",
            success: false,
            error: error.message
        });
    }
}
