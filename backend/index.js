
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { swaggerUi, swaggerSpec } = require('./swagger')

const auth_routes = require('./routes/auth')
const slot_routes = require('./routes/slot')
const parking_routes = require('./routes/parking')
const vehicle_routes = require('./routes/vehicle')

const sequelize = require('./config/db')

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec ))

app.use('/auth', auth_routes)
app.use('/slots', slot_routes)
app.use('/parkings', parking_routes)
app.use('/vehicles', vehicle_routes)

const PORT = 45000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL connection has been established successfully.')

    await sequelize.sync()
    console.log('🗄️ All models were synchronized successfully.')

    app.listen(PORT, () => {
      console.log(`🚗 Parking Management Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit(1)
  }
}

startServer()