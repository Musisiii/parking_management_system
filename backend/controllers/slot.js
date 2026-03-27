const Slot = require('../models/slot')
const Parking = require('../models/parking')

const get_slots = async (req, res) => {
  try {
    const slots = await Slot.findAll({
      include: [{ model: Parking, as: 'parking' }],
      order: [['createdAt', 'DESC']],
    })
    res.json(slots)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal server error', error: e.message })
  }
}

const add_slot = async (req, res) => {
  try {
    const { name, parkingId, status = 'available' } = req.body

    if (!name || !parkingId) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'parkingId'],
      })
    }

    const parking = await Parking.findByPk(parkingId)
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' })
    }

    await Slot.create({ name, parkingId, status })

    console.log('New slot added successfully')
    return get_slots(req, res)
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Slot name must be unique' })
    }
    console.error(e)
    res.status(500).json({ message: 'Internal server error', error: e.message })
  }
}

const get_slot = async (req, res) => {
  try {
    const { id } = req.params
    const slot = await Slot.findByPk(id, {
      include: [{ model: Parking, as: 'parking' }],
    })
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' })
    }
    res.json(slot)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal server error', error: e.message })
  }
}

module.exports = { get_slots, add_slot, get_slot }