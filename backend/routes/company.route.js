import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getCompanies, 
    getCompanyById, 
    registerCompany, 
    updateCompany,
    getCompanyStats,
    getAllCompanies
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Public Routes
router.route("/all").get(getAllCompanies);

// Protected Routes
router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompanies);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
router.route("/:id/stats").get(isAuthenticated,getCompanyStats);

export default router;

