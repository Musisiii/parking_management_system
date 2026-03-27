const nodemailer = require('nodemailer')
require('dotenv').config()

module.exports = nodemailer.createTransport( {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
} )