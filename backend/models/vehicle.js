const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Vehicle = sequelize.define('Vehicle', {
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    parkingCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    entryDateTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    exitDateTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    chargedAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
})

module.exports = Vehicle