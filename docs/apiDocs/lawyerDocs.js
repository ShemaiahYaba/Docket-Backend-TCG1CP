/**
 * @swagger
 * components:
 *   schemas:
 *     Lawyer:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *         - specialty
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         full_name:
 *           type: string
 *           description: Lawyer's full name
 *           example: "John Okonkwo"
 *         email:
 *           type: string
 *           format: email
 *           description: Lawyer's email (unique)
 *           example: "john.okonkwo@docket.com"
 *         phone:
 *           type: string
 *           description: Contact phone number
 *           example: "+2348012345678"
 *         specialty:
 *           type: string
 *           description: Area of legal specialization
 *           example: "Corporate Law"
 *         role:
 *           type: string
 *           enum: [senior_partner, associate, secretary]
 *           description: Lawyer's role in the firm
 *           example: "Associate"
 *         is_active:
 *           type: boolean
 *           description: Whether lawyer is active
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     LawyerResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Lawyer'
 *
 *     LawyersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 5
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lawyer'
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation successful"
 */

/**
 * @swagger
 * tags:
 *   name: Lawyers
 *   description: Lawyer management endpoints
 */

/**
 * @swagger
 * /lawyers:
 *   get:
 *     summary: Get all lawyers
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lawyers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LawyersListResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication required. Please log in."
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new lawyer
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *               - specialty
 *               - role
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Okonkwo"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.okonkwo@docket.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               specialty:
 *                 type: string
 *                 example: "Corporate Law"
 *               role:
 *                 type: string
 *                 enum: [senior_partner, associate, secretary]
 *                 example: "Associate"
 *     responses:
 *       201:
 *         description: Lawyer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LawyerResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Senior Partner only
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /lawyers/{id}:
 *   get:
 *     summary: Get lawyer by ID
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer UUID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lawyer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LawyerResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Cannot view inactive lawyer
 *       404:
 *         description: Lawyer not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update lawyer
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John O. Okonkwo"
 *               phone:
 *                 type: string
 *                 example: "+2348123456789"
 *               specialty:
 *                 type: string
 *                 example: "Corporate Law & Compliance"
 *               role:
 *                 type: string
 *                 enum: [senior_partner, associate, secretary]
 *                 example: "Senior Partner"
 *     responses:
 *       200:
 *         description: Lawyer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LawyerResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Senior Partner only
 *       404:
 *         description: Lawyer not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /lawyers/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a lawyer (soft delete)
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer UUID
 *     responses:
 *       200:
 *         description: Lawyer deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Cannot deactivate yourself or already deactivated
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Senior Partner only
 *       404:
 *         description: Lawyer not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /lawyers/{id}/reactivate:
 *   patch:
 *     summary: Reactivate a deactivated lawyer
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer UUID
 *     responses:
 *       200:
 *         description: Lawyer reactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lawyer reactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Lawyer'
 *       400:
 *         description: Lawyer already active
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - Senior Partner only
 *       404:
 *         description: Lawyer not found
 *       500:
 *         description: Server error
 */
