import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let company = await Company.findOne({ name });
        if (company) {
            return res.status(400).json({
                message: "Company with this name already exists.",
                success: false
            })
        };

        company = await Company.create({
            name,
            userId: req.id,
            location: 'Islamabad' // Default location
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error registering company",
            success: false,
            error: error.message
        });
    }
}

// Get all companies for recruiter
export const getCompanies = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });

        if (!companies || companies.length === 0) {
            return res.status(200).json({
                message: "No companies found.",
                companies: [],
                success: true
            })
        }

        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving companies",
            success: false,
            error: error.message
        });
    }
}

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId).populate('userId', 'fullname email profile');

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving company",
            success: false,
            error: error.message
        });
    }
}

// Update company information
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location, industry, companySize, socialLinks } = req.body;
        const userId = req.id;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        // Check authorization
        if (company.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this company.",
                success: false
            })
        }

        // Handle logo upload
        let logoUrl = company.logo;
        const file = req.file;
        if (file && process.env.API_KEY) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.log("Logo upload failed:", uploadError);
            }
        }

        // Update company fields
        const updateData = { 
            logo: logoUrl
        };

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;
        if (industry) updateData.industry = industry;
        if (companySize) updateData.companySize = companySize;
        if (socialLinks) updateData.socialLinks = socialLinks;

        const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        return res.status(200).json({
            message: "Company updated successfully.",
            company: updatedCompany,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating company",
            success: false,
            error: error.message
        });
    }
}

// Get company dashboard statistics
export const getCompanyStats = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        // Check authorization
        if (company.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to view company stats.",
                success: false
            })
        }

        // Get statistics
        const totalJobs = await Job.countDocuments({ company: companyId });
        const activeJobs = await Job.countDocuments({ company: companyId, isActive: true });
        const totalApplications = await Application.countDocuments({
            job: { $in: await Job.find({ company: companyId }).select('_id') }
        });

        const applicationStats = await Application.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobData'
                }
            },
            {
                $match: {
                    'jobData.company': require('mongodb').ObjectId(companyId)
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            stats: {
                totalJobs,
                activeJobs,
                totalApplications,
                applicationStats
            },
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving company statistics",
            success: false,
            error: error.message
        });
    }
}

// Get all companies (for students to browse)
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({})
            .populate('userId', 'fullname email')
            .select('-userId') // Don't expose userId in public listing
            .limit(20);

        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving companies",
            success: false,
            error: error.message
        });
    }
}