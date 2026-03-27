const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Parking = require('./parking')

const Slot = sequelize.define('Slot', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  parkingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'unavailable'),
    allowNull: false,
    defaultValue: 'available'
  }
}, {
  timestamps: true,
  tableName: 'slots'
})

Slot.belongsTo(Parking, {
    foreignKey: { name: 'parkingId', allowNull: false },
    as: 'parking'
  })
  Parking.hasMany(Slot, {
    foreignKey: 'parkingId',
    as: 'slots'
  })

module.exports = Slot