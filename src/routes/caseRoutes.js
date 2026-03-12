import express from 'express';
import * as caseController from '../controllers/caseController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// All case routes require authentication
router.use(authMiddleware);

// Create a new case — senior_partner, secretary only
router.post('/', roleMiddleware([ROLES.SENIOR_PARTNER, ROLES.SECRETARY]), caseController.createCase);
// Get all cases (associates see only their own)
router.get('/', caseController.getAllCases);
// Get all valid case types — must be before /:id
router.get('/types', caseController.getCaseTypes);
// Get recent cases (last 10) — must be before /:id
router.get('/recent', caseController.getRecentCases);
// Get a case by ID (basic)
router.get('/:id', caseController.getCaseById);
// Get full case detail with client, lawyer, and hearings
router.get('/:id/detail', caseController.getCaseDetail);
// Update a case — senior_partner, secretary only
router.put('/:id', roleMiddleware([ROLES.SENIOR_PARTNER, ROLES.SECRETARY]), caseController.updateCase);
// Delete a case — senior_partner only
router.delete('/:id', roleMiddleware([ROLES.SENIOR_PARTNER]), caseController.deleteCase);
// Assign a lawyer to a case — senior_partner, secretary only
router.patch('/:id/assign', roleMiddleware([ROLES.SENIOR_PARTNER, ROLES.SECRETARY]), caseController.assignLawyer);
// Update case status — any authenticated user
router.patch('/:id/status', caseController.updateCaseStatus);
// Get hearings for a case
router.get('/:id/hearings', caseController.getCaseHearings);

export default router;
