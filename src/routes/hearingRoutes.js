import express from 'express';
import hearingController from '../controllers/hearing.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();
// Apply authentication middleware globally to all hearing routes
router.use(authMiddleware);

// Define hearing routes
router.get("/", hearingController.getAllHearings);
router.post("/", hearingController.createHearing);
router.get("/:id", hearingController.getHearingById);
router.put("/:id", hearingController.updateHearing);
router.delete("/:id", hearingController.deleteHearing);

//Additional routes for upcoming hearings and case-specific hearings
router.get("/upcoming", hearingController.getUpcomingHearings);
router.get("/:id/case-hearings", hearingController.getCaseHearings);


export default router;