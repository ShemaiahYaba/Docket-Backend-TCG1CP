import express from 'express';
const router = express.Router();
import { body, param } from 'express-validator';
import {
  getAllLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deactivateLawyer,
  reactivateLawyer,
} from "../controllers/lawyerController.js";

import{authMiddleware, roleMiddleware} from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

import { ROLES } from '../constants/index.js';



// validation rules for creating/updating a lawyer
const createLawyerValidation = [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Full name must be between 2 and 255 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role specified"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("speciality")
    .notEmpty()
    .withMessage("Specialty is required")
    .isLength({ max: 100 })
    .withMessage("Specialty must not exceed 100 characters")
];

// validation rules for updating a lawyer (all fields optional but must be valid if provided)

const updateLawyerValidation = [
  param("id").isUUID().withMessage("Invalid lawyer ID format"),

  body("full_name")
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  body("specialty")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Specialty must not exceed 100 characters"),

  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role specified"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
];

// Validation for ID parameter in routes that require a lawyer ID
const idValidation = [
    param("id").isUUID().withMessage("Invalid lawyer ID format")
];

// All routes in this file are protected and require authentication
router.use(authMiddleware);

// @route   GET /api/lawyers
// @desc    Get all lawyers (Senior partners can see all, others can only see themselves)
// router.get("/lawyers", authMiddleware(ROLES.SENIOR_PARTNER), getAllLawyers);
router.get("/lawyers", getAllLawyers);

// @route   GET /api/lawyers/:id
// @desc    Get a single lawyer by ID (Senior partners can see all, others can only see themselves)
router.get("/lawyers/:id", idValidation, validate, getLawyerById);


// @route   POST /api/lawyers
// @desc    Create a new lawyer (Only senior partners can create lawyers)
router.post("/lawyers", roleMiddleware(ROLES.SENIOR_PARTNER), createLawyerValidation,validate, createLawyer);


// @route   PUT /api/lawyers/:id
// @desc    Update a lawyer (Senior partners can update all, others can only update themselves)
router.put("/lawyers/:id", roleMiddleware(ROLES.SENIOR_PARTNER), updateLawyerValidation,validate, updateLawyer);


// @route   DEACTIVATE /api/lawyers/:id/deactivate
// @desc    Deactivate a lawyer (Senior partners can deactivate all, others can only deactivate themselves)
router.patch("/lawyers/:id/deactivate", roleMiddleware(ROLES.SENIOR_PARTNER), idValidation, validate, deactivateLawyer);


// @route REACTIVATE /api/lawyers/:id/reactivate
// @desc Reactivate a lawyer (Senior partners can reactivate all, others can only reactivate themselves)
router.patch("/lawyers/:id/reactivate", roleMiddleware(ROLES.SENIOR_PARTNER), idValidation, validate, reactivateLawyer);


export const lawyerRoutes = router;