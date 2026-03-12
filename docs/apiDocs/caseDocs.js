/**
 * @swagger
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "SLT-001"
 *           description: Auto-generated case reference (SLT-XXX format)
 *         title:
 *           type: string
 *           example: "Obiageli Ventures v. Zenith Bank"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Dispute over contract non-performance"
 *         case_type:
 *           type: string
 *           enum: [Civil, Criminal, Corporate, Family, Property]
 *           example: "Corporate"
 *         status:
 *           type: string
 *           enum: [Active, Pending, In Review, Urgent, Closed]
 *           example: "Active"
 *         client_id:
 *           type: string
 *           format: uuid
 *           example: "660f9500-f39c-42e5-b827-557766550001"
 *         lawyer_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         filed_date:
 *           type: string
 *           format: date
 *           example: "2026-01-15"
 *         closed_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CaseResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Case'
 *
 *     CasesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 18
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Case'
 */

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Case management endpoints
 */

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Get all cases
 *     description: >
 *       Returns all cases. Associates only see cases assigned to them.
 *       Senior partners and secretaries see all cases.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Pending, In Review, Urgent, Closed]
 *         description: Filter by case status
 *       - in: query
 *         name: caseType
 *         schema:
 *           type: string
 *           enum: [Civil, Criminal, Corporate, Family, Property]
 *         description: Filter by case type
 *     responses:
 *       200:
 *         description: List of cases
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CasesListResponse'
 *       401:
 *         description: Authentication required
 *
 *   post:
 *     summary: Create a new case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - case_type
 *               - client_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Obiageli Ventures v. Zenith Bank"
 *               description:
 *                 type: string
 *                 example: "Dispute over contract non-performance"
 *               case_type:
 *                 type: string
 *                 enum: [Civil, Criminal, Corporate, Family, Property]
 *                 example: "Corporate"
 *               status:
 *                 type: string
 *                 enum: [Active, Pending, In Review, Urgent, Closed]
 *                 example: "Pending"
 *               client_id:
 *                 type: string
 *                 format: uuid
 *                 example: "660f9500-f39c-42e5-b827-557766550001"
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *               filed_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-12"
 *     responses:
 *       201:
 *         description: Case created with auto-generated SLT-XXX ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner or secretary only
 */

/**
 * @swagger
 * /cases/{id}:
 *   get:
 *     summary: Get a case by ID
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     responses:
 *       200:
 *         description: Case details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Case not found
 *
 *   put:
 *     summary: Update a case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               case_type:
 *                 type: string
 *                 enum: [Civil, Criminal, Corporate, Family, Property]
 *               client_id:
 *                 type: string
 *                 format: uuid
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *               filed_date:
 *                 type: string
 *                 format: date
 *               closed_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner or secretary only
 *       404:
 *         description: Case not found
 *
 *   delete:
 *     summary: Delete a case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     responses:
 *       200:
 *         description: Case deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner only
 *       404:
 *         description: Case not found
 */

/**
 * @swagger
 * /cases/{id}/assign:
 *   patch:
 *     summary: Assign or reassign a lawyer to a case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lawyer_id
 *             properties:
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         description: Lawyer assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner or secretary only
 *       404:
 *         description: Case not found
 */

/**
 * @swagger
 * /cases/{id}/status:
 *   patch:
 *     summary: Update case status
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Pending, In Review, Urgent, Closed]
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Case status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Case not found
 */

/**
 * @swagger
 * /cases/{id}/hearings:
 *   get:
 *     summary: Get all hearings for a case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "SLT-001"
 *     responses:
 *       200:
 *         description: List of hearings for the case
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HearingsListResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Case not found
 */
