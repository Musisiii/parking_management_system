const express = require('express')
const router = express.Router()
const controller = require('../controllers/vehicle')
const verifyToken = require('../middlewares/auth').verify_token

router.use(verifyToken)

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /vehicles/all:
 *   get:
 *     summary: Get all vehicles for the logged-in user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/all', controller.getVehicles)

/**
 * @swagger
 * /vehicles/add:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 *               entryDateTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 */
router.post('/add', controller.addVehicle)

/**
 * @swagger
 * /vehicles/report/outgoing:
 *   get:
 *     summary: Get report of exited vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles that exited
 */
router.get('/report/outgoing', controller.exited)

/**
 * @swagger
 * /vehicles/report/entered:
 *   get:
 *     summary: Get report of entered vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles that entered
 */
router.get('/report/entered', controller.entered)

/**
 * @swagger
 * /vehicles/entry:
 *   post:
 *     summary: Mark a vehicle as entered
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - parkingCode
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle entry recorded
 */
router.post('/entry', controller.carEntry)

/**
 * @swagger
 * /vehicles/exit:
 *   post:
 *     summary: Mark a vehicle as exited and generate bill
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *             properties:
 *               plateNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle exit recorded and bill generated
 */
router.post('/exit', controller.carExit)

module.exports = router