const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Parking = sequelize.define('Parking', {
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availableSlots : {
        type: DataTypes.INTEGER,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pricePerHour: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        min: 500
    }}
}, {
    timestamps: true,
    tableName: 'parkings'
})

module.exports = Parking