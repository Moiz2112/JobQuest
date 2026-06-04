import express from 'express';
import { createReport, getReports, getReport, resolveReport } from '../controllers/report.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/').get(isAuthenticated, getReports).post(createReport);
router.route('/:id').get(isAuthenticated, getReport);
router.route('/:id/resolve').patch(isAuthenticated, resolveReport);

export default router;
