import express from "express";
import { 
    getAllUsers,
    banUser,
    getAllJobs,
    updateAdminJob,
    deleteJob,
    getAllCompanies,
    approveCompany,
    rejectCompany,
    getAllApplications,
    getDashboardStats
} from "../controllers/admin.controller.js";
import { adminLogin } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Admin Authentication
router.route("/login").post(adminLogin);

// Dashboard
router.route("/dashboard/stats").get(isAuthenticated, getDashboardStats);

// Users Management
router.route("/users").get(isAuthenticated, getAllUsers);
router.route("/users/:userId/ban").patch(isAuthenticated, banUser);

// Jobs Management
router.route("/jobs").get(isAuthenticated, getAllJobs);
router.route("/jobs/:jobId").patch(isAuthenticated, updateAdminJob).delete(isAuthenticated, deleteJob);

// Companies Management
router.route("/companies").get(isAuthenticated, getAllCompanies);
router.route("/companies/:companyId/approve").patch(isAuthenticated, approveCompany);
router.route("/companies/:companyId/reject").patch(isAuthenticated, rejectCompany);

// Applications Management
router.route("/applications").get(isAuthenticated, getAllApplications);

export default router;
