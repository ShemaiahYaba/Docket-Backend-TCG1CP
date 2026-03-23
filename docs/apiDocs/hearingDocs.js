/**
 * @swagger
 * components:
 *   schemas:
 *     Hearing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "770a0600-g40d-53f6-c938-668877660001"
 *         case_id:
 *           type: string
 *           example: "SLT-001"
 *         hearing_date:
 *           type: string
 *           format: date
 *           example: "2026-03-20"
 *         hearing_time:
 *           type: string
 *           nullable: true
 *           example: "09:00:00"
 *         court_name:
 *           type: string
 *           nullable: true
 *           example: "Lagos High Court"
 *         notes:
 *           type: string
 *           nullable: true
 *           example: "Opening arguments"
 *         outcome:
 *           type: string
 *           nullable: true
 *           example: "Adjourned to next month"
 *         created_by:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     HearingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Hearing'
 *
 *     HearingsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 12
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Hearing'
 */

/**
 * @swagger
 * tags:
 *   name: Hearings
 *   description: Court hearing management endpoints
 */

/**
 * @swagger
 * /hearings/upcoming:
 *   get:
 *     summary: Get upcoming hearings (today and future, max 10)
 *     description: Returns hearings ordered by soonest first. Useful for the dashboard.
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming hearings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingsListResponse'
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /hearings:
 *   get:
 *     summary: Get all hearings
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: case_id
 *         schema:
 *           type: string
 *         description: Filter hearings by case ID
 *         example: "SLT-001"
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [upcoming, this_week]
 *         description: >
 *           `upcoming` — hearings from today onwards.
 *           `this_week` — hearings within the next 7 days.
 *           Omit to return all hearings.
 *     responses:
 *       200:
 *         description: List of hearings ordered by date ascending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingsListResponse'
 *       401:
 *         description: Authentication required
 *
 *   post:
 *     summary: Schedule a new hearing
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - case_id
 *               - hearing_date
 *             properties:
 *               case_id:
 *                 type: string
 *                 example: "SLT-001"
 *               hearing_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-10"
 *               hearing_time:
 *                 type: string
 *                 example: "09:00"
 *               court_name:
 *                 type: string
 *                 example: "Lagos High Court"
 *               notes:
 *                 type: string
 *                 example: "Opening arguments"
 *     responses:
 *       201:
 *         description: Hearing scheduled. created_by is set automatically from the JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingResponse'
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /hearings/{id}:
 *   get:
 *     summary: Get a hearing by ID
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Hearing details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Hearing not found
 *
 *   put:
 *     summary: Update a hearing
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hearing_date:
 *                 type: string
 *                 format: date
 *               hearing_time:
 *                 type: string
 *               court_name:
 *                 type: string
 *               notes:
 *                 type: string
 *               outcome:
 *                 type: string
 *                 example: "Ruling in favour of plaintiff"
 *     responses:
 *       200:
 *         description: Hearing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Hearing not found
 *
 *   delete:
 *     summary: Delete a hearing
 *     tags: [Hearings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Hearing deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Hearing not found
 */
