import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getStats, getUpcomingHearings, getRecentCases } from '../controllers/dashboardController.js';

const router = Router();

// All dashboard endpoints require authentication.
// No role restriction — all three roles can access the dashboard.
// Associates automatically see filtered data (their cases only) via caseScope() in the controller.
router.use(authMiddleware);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get aggregate case statistics
 *     description: >
 *       Returns total counts and breakdowns by status and case type.
 *       Associates see stats for their assigned cases only.
 *       Senior partners and secretaries see firm-wide stats.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: Authentication required
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /dashboard/upcoming-hearings:
 *   get:
 *     summary: Get upcoming hearings for the dashboard
 *     description: >
 *       Returns the next 10 hearings from today sorted by date ascending.
 *       Includes nested case (with client name) and the lawyer who scheduled it.
 *       Associates only see hearings for their assigned cases.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upcoming hearings list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingsListResponse'
 *       401:
 *         description: Authentication required
 */
router.get('/upcoming-hearings', getUpcomingHearings);

/**
 * @swagger
 * /dashboard/recent-cases:
 *   get:
 *     summary: Get recently updated cases for the dashboard
 *     description: >
 *       Returns the 10 most recently updated cases ordered by updated_at descending.
 *       Includes nested client and assigned lawyer.
 *       Associates only see their own cases.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent cases list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CasesListResponse'
 *       401:
 *         description: Authentication required
 */
router.get('/recent-cases', getRecentCases);

export default router;
