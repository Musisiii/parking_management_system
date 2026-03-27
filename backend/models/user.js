// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db')

const User = sequelize.define(
  'User',
  {
    names: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'users'
  }
)

module.exports = User