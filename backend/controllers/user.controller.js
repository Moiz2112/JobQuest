import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail, emailTemplates } from "../utils/emailService.js";


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }
        
        let profilePhoto = null;
        const file = req.file;
        
        // Only upload if file exists and Cloudinary is configured
        if (file && process.env.API_KEY) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: profilePhoto,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating account",
            success: false,
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error during login",
            success: false,
            error: error.message
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error during logout",
            success: false,
            error: error.message
        });
    }
}

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admin credentials required.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };
        
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' });

        const adminUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back Admin ${adminUser.fullname}`,
            admin: adminUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error during admin login",
            success: false,
            error: error.message
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, headline } = req.body;
        
        const file = req.file;
        let cloudResponse = null;
        if (file && process.env.API_KEY) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if(skills){
            skillsArray = typeof skills === 'string' ? skills.split(",") : skills;
        }
        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(headline) user.profile.headline = headline
        if(skills) user.profile.skills = skillsArray

        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url
            user.profile.resumeOriginalName = file.originalname
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating profile",
            success: false,
            error: error.message
        });
    }
}

// Add education
export const addEducation = async (req, res) => {
    try {
        const { school, degree, fieldOfStudy, startDate, endDate, current, description } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.profile.education.push({
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            current,
            description
        });

        await user.save();

        return res.status(200).json({
            message: "Education added successfully",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error adding education",
            success: false,
            error: error.message
        });
    }
}

// Add experience
export const addExperience = async (req, res) => {
    try {
        const { title, company, location, startDate, endDate, current, description } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.profile.experience.push({
            title,
            company,
            location,
            startDate,
            endDate,
            current,
            description
        });

        await user.save();

        return res.status(200).json({
            message: "Experience added successfully",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error adding experience",
            success: false,
            error: error.message
        });
    }
}

// Update resume
export const updateResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file provided",
                success: false
            });
        }

        if (!process.env.API_KEY) {
            return res.status(500).json({
                message: "Cloudinary configuration missing",
                success: false
            });
        }

        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;

        await user.save();

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resume: user.profile.resume,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error uploading resume",
            success: false,
            error: error.message
        });
    }
}

// Save a job
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if job already saved
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job already saved",
                success: false
            });
        }

        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Job saved successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error saving job",
            success: false,
            error: error.message
        });
    }
}

// Unsave a job
export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        return res.status(200).json({
            message: "Job removed from saved",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error removing saved job",
            success: false,
            error: error.message
        });
    }
}

// Get saved jobs
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('savedJobs');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Saved jobs retrieved",
            jobs: user.savedJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving saved jobs",
            success: false,
            error: error.message
        });
    }
}

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('savedJobs').populate('appliedJobs');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile retrieved",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving profile",
            success: false,
            error: error.message
        });
    }
}


