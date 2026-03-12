/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "660f9500-f39c-42e5-b827-557766550001"
 *         full_name:
 *           type: string
 *           example: "Obiageli Ventures Ltd"
 *         email:
 *           type: string
 *           format: email
 *           example: "obiageli@ventures.com"
 *         phone:
 *           type: string
 *           example: "+2348012345678"
 *         address:
 *           type: string
 *           nullable: true
 *           example: "14 Marina Street, Lagos"
 *         client_type:
 *           type: string
 *           enum: [individual, corporate]
 *           example: "corporate"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     ClientResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Client'
 *
 *     ClientsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Client'
 */

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management endpoints
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter by full_name or email (partial match)
 *         example: "Obiageli"
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientsListResponse'
 *       401:
 *         description: Authentication required
 *
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
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
 *               - phone
 *               - client_type
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Marcus Johnson"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "marcus.j@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "+2348023456789"
 *               address:
 *                 type: string
 *                 example: "22 Broad Street, Lagos"
 *               client_type:
 *                 type: string
 *                 enum: [individual, corporate]
 *                 example: "individual"
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner or secretary only
 *       409:
 *         description: Email already registered
 */

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by ID (includes associated cases)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "660f9500-f39c-42e5-b827-557766550001"
 *     responses:
 *       200:
 *         description: Client details with associated cases
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientResponse'
 *       400:
 *         description: Invalid UUID format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Client not found
 *
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
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
 *               full_name:
 *                 type: string
 *                 example: "Marcus O. Johnson"
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               client_type:
 *                 type: string
 *                 enum: [individual, corporate]
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner or secretary only
 *       404:
 *         description: Client not found
 *       409:
 *         description: Email already in use
 *
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
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
 *         description: Client deleted successfully
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
 *                   example: "Client deleted successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden — senior_partner only
 *       404:
 *         description: Client not found
 */
