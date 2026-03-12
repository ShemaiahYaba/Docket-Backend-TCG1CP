import express from 'express';
import * as hearingController from '../controllers/hearingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All hearing routes require authentication
router.use(authMiddleware);

// /upcoming must be defined BEFORE /:id to avoid Express matching "upcoming" as an ID
router.get('/upcoming', hearingController.getUpcomingHearings);

router.get('/', hearingController.getAllHearings);
router.post('/', hearingController.createHearing);
router.get('/:id', hearingController.getHearingById);
router.put('/:id', hearingController.updateHearing);
router.delete('/:id', hearingController.deleteHearing);

export default router;
