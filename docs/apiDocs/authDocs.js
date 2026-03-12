/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         full_name:
 *           type: string
 *           example: "Adaeze Okonkwo"
 *         email:
 *           type: string
 *           format: email
 *           example: "senior@docket.com"
 *         role:
 *           type: string
 *           enum: [senior_partner, associate, secretary]
 *           example: "senior_partner"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: '#/components/schemas/AuthUser'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Invalid email or password."
 *         data:
 *           type: object
 *           nullable: true
 *           example: null
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new lawyer account
 *     tags: [Auth]
 *     security: []
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
 *                 example: "Emeka Nwosu"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "emeka.nwosu@docket.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               specialty:
 *                 type: string
 *                 example: "Criminal Law"
 *               role:
 *                 type: string
 *                 enum: [senior_partner, associate, secretary]
 *                 example: "associate"
 *     responses:
 *       201:
 *         description: Account created — returns JWT and user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "senior@docket.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful — returns JWT and user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out (client-side token invalidation)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *                   example: "Logged out successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated lawyer's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lawyer'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Account not found
 */
