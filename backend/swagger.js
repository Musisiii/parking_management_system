const swaggerJsdoc = require( 'swagger-jsdoc' )
const swaggerUi = require( 'swagger-ui-express' )

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Parking Management System API',
            version: '1.0.0',
            description: 'RESTful API with JWT auth and Swagger docs'
        },
        servers: [ { url: 'http://localhost:45000' } ]
    },
    apis: [ './routes/*.js' ]
}

const swaggerSpec = swaggerJsdoc( options )

module.exports = { swaggerUi, swaggerSpec }