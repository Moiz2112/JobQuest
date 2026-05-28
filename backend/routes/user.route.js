import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile,
    addEducation,
    addExperience,
    updateResume,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getProfile
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

// Authentication
router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Profile Management
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/profile/education").post(isAuthenticated, addEducation);
router.route("/profile/experience").post(isAuthenticated, addExperience);
router.route("/profile/resume").post(isAuthenticated, singleUpload, updateResume);

// Job Saving
router.route("/jobs/save/:jobId").post(isAuthenticated, saveJob);
router.route("/jobs/unsave/:jobId").post(isAuthenticated, unsaveJob);
router.route("/jobs/saved").get(isAuthenticated, getSavedJobs);

export default router;

