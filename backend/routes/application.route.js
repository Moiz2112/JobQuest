import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    applyJob, 
    getApplicants, 
    getAppliedJobs, 
    updateStatus,
    scheduleInterview,
    getApplicationById
} from "../controllers/application.controller.js";
 
const router = express.Router();

// Student Routes
router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id").get(isAuthenticated, getApplicationById);

// Recruiter Routes
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/:id/status").put(isAuthenticated, updateStatus);
router.route("/:id/interview").post(isAuthenticated, scheduleInterview);

export default router;

