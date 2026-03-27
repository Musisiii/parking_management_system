const Parking = require('../models/parking')

const get_parkings = async (req, res) => {
  try {
    const parkings = await Parking.findAll({
      order: [['createdAt', 'DESC']],
    })
    res.json(parkings)
  } catch (e) {
    console.error(e)
    res
      .status(500)
      .json({ message: 'Internal server error', error: e.message })
  }
}

const add_parking = async (req, res) => {
  try {
    const { code, name, location, pricePerHour, availableSlots } = req.body
    if (!code || !name || !location || !pricePerHour) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['code', 'name', 'location', 'pricePerHour']
      })
    }

    await Parking.create({ code, name, location, pricePerHour, availableSlots })
    console.log('New parking added successfully')

    return get_parkings(req, res)
  } catch (e) {
    console.error(e)
    res
      .status(500)
      .json({ message: 'Internal server error', error: e.message })
  }
}

module.exports = { get_parkings, add_parking }