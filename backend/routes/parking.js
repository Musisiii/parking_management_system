const express = require('express')
const router = express.Router()
const controller = require('../controllers/parking')

/**
 * @swagger
 * /parkings/all:
 *   get:
 *     summary: Get all parkings
 *     tags: [Parkings]
 *     responses:
 *       200:
 *         description: List of parkings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parking'
 */
router.get('/all', controller.get_parkings)

/**
 * @swagger
 * /parkings/add:
 *   post:
 *     summary: Create a new parking parking
 *     tags: [Parkings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Parking created
 *       400:
 *         description: Validation error
 */
router.post('/add', controller.add_parking)

module.exports = router