import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { ROLES, CLIENT_TYPE } from '../constants/index.js';

const router = express.Router();

// ── Validation rules ──────────────────────────────────────────────────────────

const createClientValidation = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Full name must be between 2 and 255 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isString().withMessage('Address must be a string'),
  body('client_type')
    .notEmpty().withMessage('Client type is required')
    .isIn(Object.values(CLIENT_TYPE)).withMessage('Invalid client type'),
];

const updateClientValidation = [
  param('id').isUUID().withMessage('Invalid client ID format'),
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 255 }).withMessage('Full name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isString().withMessage('Address must be a string'),
  body('client_type')
    .optional()
    .isIn(Object.values(CLIENT_TYPE)).withMessage('Invalid client type'),
];

const idValidation = [
  param('id').isUUID().withMessage('Invalid client ID format'),
];

// ── Routes (all require authentication) ──────────────────────────────────────

router.use(authMiddleware);

// @route   GET /api/clients
// @desc    Get all clients (supports ?search= query)
router.get('/', getAllClients);

// @route   GET /api/clients/:id
// @desc    Get a single client with their cases
router.get('/:id', idValidation, validate, getClientById);

// @route   POST /api/clients
// @desc    Create a new client (senior_partner, secretary)
router.post(
  '/',
  roleMiddleware([ROLES.SENIOR_PARTNER, ROLES.SECRETARY]),
  createClientValidation,
  validate,
  createClient
);

// @route   PUT /api/clients/:id
// @desc    Update a client (senior_partner, secretary)
router.put(
  '/:id',
  roleMiddleware([ROLES.SENIOR_PARTNER, ROLES.SECRETARY]),
  updateClientValidation,
  validate,
  updateClient
);

// @route   DELETE /api/clients/:id
// @desc    Delete a client (senior_partner only)
router.delete(
  '/:id',
  roleMiddleware([ROLES.SENIOR_PARTNER]),
  idValidation,
  validate,
  deleteClient
);

export default router;
