import express from 'express';
import * as caseController from '../controllers/caseController.js';


const router = express.Router();

//authMiddleware is applied globally to all case routes in app.js, so no need to apply it here

// Create a new case
router.post("/", caseController.createCase);
// Get all cases
router.get("/", caseController.getAllCases);
// Get a case by ID
router.get("/:id", caseController.getCaseById);
// Update a case
router.put("/:id", caseController.updateCase);
// Delete a case
router.delete("/:id", caseController.deleteCase);
// Assign a lawyer to a case
router.patch("/:id/assign", caseController.assignLawyer);
// Update case status
router.patch("/:id/status", caseController.updateCaseStatus);
// Get hearings for a case
router.get("/:id/hearings", caseController.getCaseHearings);

// router.get("/:id/hearings", hearingController.getCaseHearings);