/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Dashboard stats retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             total_cases:
 *               type: integer
 *               example: 18
 *             total_clients:
 *               type: integer
 *               example: 12
 *             upcoming_hearings:
 *               type: integer
 *               description: Number of hearings scheduled from today onwards
 *               example: 5
 *             by_status:
 *               type: object
 *               description: Case count for each status value
 *               properties:
 *                 Active:
 *                   type: integer
 *                   example: 5
 *                 Pending:
 *                   type: integer
 *                   example: 4
 *                 In Review:
 *                   type: integer
 *                   example: 3
 *                 Urgent:
 *                   type: integer
 *                   example: 3
 *                 Closed:
 *                   type: integer
 *                   example: 3
 *             by_type:
 *               type: object
 *               description: Case count for each case type value
 *               properties:
 *                 Civil:
 *                   type: integer
 *                   example: 4
 *                 Criminal:
 *                   type: integer
 *                   example: 3
 *                 Corporate:
 *                   type: integer
 *                   example: 6
 *                 Family:
 *                   type: integer
 *                   example: 3
 *                 Property:
 *                   type: integer
 *                   example: 2
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregate stats and summary endpoints for the dashboard view
 */
