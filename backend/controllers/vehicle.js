const Vehicle = require('../models/vehicle')
const Parking = require('../models/parking')
const { Op } = require('sequelize')
const transporter = require('../utils/email')

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll()
    res.json(vehicles)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch vehicles', error: err.message })
  }
}

exports.addVehicle = async (req, res) => {
  try {
    const { plateNumber, parkingCode } = req.body
    if (!plateNumber) return res.status(400).json({ message: 'Plate number is required' })
    if (!parkingCode) return res.status(400).json({ message: 'Parking code is required' })

    const parking = await Parking.findByPk(parkingCode)
    if (!parking) return res.status(404).json({ message: 'Parking not found' })
    if (parking.availableSlots <= 0) return res.status(400).json({ message: 'No available slots in this parking' })

    const existingVehicle = await Vehicle.findOne({ where: { plateNumber, exitDateTime: null } })
    if (existingVehicle) return res.status(400).json({ message: 'Vehicle already exists in the system' })

    const entryTime = new Date()
    const vehicle = await Vehicle.create({
      userId: req.user.id,
      plateNumber,
      parkingCode,
      entryDateTime: entryTime.toISOString(),
    })

    res.status(201).json({ message: 'Vehicle created successfully', vehicle })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to add vehicle', error: err.message })
  }
}

exports.carEntry = async (req, res) => {
  try {
    const { plateNumber, parkingCode } = req.body
    if (!plateNumber || !parkingCode) {
      return res.status(400).json({ message: 'Plate number and parking code are required' })
    }

    const parking = await Parking.findByPk(parkingCode)
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' })
    }
    if (parking.availableSlots <= 0) {
      return res.status(400).json({ message: 'No available slots in this parking' })
    }

    const entryTime = new Date()
    const vehicle = await Vehicle.create({
      userId: req.user.id,
      plateNumber,
      parkingCode,
      entryDateTime: entryTime.toISOString(), // <-- This is a string!
    })

    await Parking.decrement('availableSlots', { where: { id: parkingCode } })

    res.status(201).json({
      message: 'Car entry registered. Ticket issued.',
      ticket: {
        plateNumber,
        entryTime: entryTime.toISOString(),
        parkingCode,
      },
      vehicle,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error during car entry', error: err.message })
  }
}

exports.carExit = async (req, res) => {
  try {
    const { plateNumber } = req.body
    if (!plateNumber) {
      return res.status(400).json({ message: 'Plate number is required' })
    }

    const vehicle = await Vehicle.findOne({ where: { plateNumber, exitDateTime: null } })
    if (!vehicle) {
      return res.status(404).json({ message: 'No active entry found for this plate number' })
    }

    const parking = await Parking.findByPk(vehicle.parkingCode)
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' })
    }

    const exitTime = new Date()
    const entryTime = new Date(vehicle.entryDateTime)
    const hoursParked = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60))
    const totalAmount = hoursParked * parking.pricePerHour

    await vehicle.update({ exitDateTime: exitTime.toISOString(), chargedAmount: totalAmount })
    await Parking.increment('availableSlots', { where: { id: vehicle.parkingCode } })

    const userEmail = req.user?.email

    let emailSent = false
    let emailError = null

    if (userEmail) {
      try {
        await transporter.sendMail({
          from: `"Parking Management System" <${process.env.EMAIL_USER}>`,
          to: userEmail,
          subject: 'Your Parking Bill',
          text: `Dear user,\n\nYour bill for plate ${plateNumber}:\nEntry: ${entryTime.toLocaleString()}\nExit: ${exitTime.toLocaleString()}\nHours Parked: ${hoursParked}\nTotal Amount: ${totalAmount}\n\nThank you for using our service!`
        })
        emailSent = true
      } catch (err) {
        emailError = err.message
        console.error('Failed to send email:', err)
      }
    }

    res.json({
      message: `Bill calculated, car may now exit.${emailSent ? ' Bill has been sent to your email.' : ''}`,
      bill: {
        plateNumber,
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        hoursParked,
        totalAmount,
      },
      emailSent,
      ...(emailError && { emailError })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error during car exit', error: err.message })
  }
}

exports.exited = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide startDate and endDate' })
    }

    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)

    const vehicles = await Vehicle.findAll({ where: { exitDateTime: { [Op.ne]: null } } })

    const outgoingCars = vehicles.filter((v) => {
      return (
        v.exitDateTime &&
        new Date(v.exitDateTime) >= new Date(startDate) &&
        new Date(v.exitDateTime) < end
      )
    })

    const total = outgoingCars.reduce((sum, v) => sum + (v.chargedAmount || 0), 0)

    res.json({ cars: outgoingCars, totalChargedAmount: total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong', error: err.message })
  }
}

exports.entered = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide startDate and endDate' })
    }

    const vehicles = await Vehicle.findAll()

    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)

    const enteredCars = vehicles.filter((v) => {
      return (
        v.entryDateTime &&
        new Date(v.entryDateTime) >= new Date(startDate) &&
        new Date(v.entryDateTime) < end
      )
    })

    res.json({ cars: enteredCars })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong', error: err.message })
  }
}