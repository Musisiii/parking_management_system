const express = require('express')
const router = express.Router()
const controller = require('../controllers/slot')
const verifyToken = require('../middlewares/auth').verify_token
const { Slot } = require('../models/slot')

/**
 * @swagger
 * tags:
 *   name: Slots
 *   description: Manage parking slots
 */

/**
 * @swagger
 * /slots/get/all:
 *   get:
 *     summary: Get all slots
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: List of slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slot'
 */
router.get('/all', controller.get_slots)

/**
 * @swagger
 * /slots/get/{id}:
 *   get:
 *     summary: Get a specific slot
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: slot details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 */
router.get('/get/:id', controller.get_slot)

/**
 * @swagger
 * /slots/add:
 *   post:
 *     summary: Add a new slot
 *     tags: [Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       201:
 *         description: Slot created
 */
router.post('/add', controller.add_slot)

module.exports = router