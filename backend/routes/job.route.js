import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    postJob,
    updateJob,
    deleteJob,
    getJobApplicants,
    getFeaturedJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// Public/Protected Get Routes
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/featured").get(getFeaturedJobs);

// Admin/Recruiter Routes
router.route("/post").post(isAuthenticated, postJob);
router.route("/admin/jobs").get(isAuthenticated, getAdminJobs);
router.route("/:id").put(isAuthenticated, updateJob);
router.route("/:id").delete(isAuthenticated, deleteJob);
router.route("/:id/applicants").get(isAuthenticated, getJobApplicants);

export default router;

