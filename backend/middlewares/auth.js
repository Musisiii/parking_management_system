const jwt= require( 'jsonwebtoken' )
require( 'dotenv' ).config()

const SECRET = process.env.JWT_SECRET

module.exports.verify_token = ( req, res, next ) => {
    const auth = req.headers.authorization

    if( !auth || !auth.startsWith( 'Bearer ' ) ) {
        return res.status( 403 ).json( { message: 'Unauthorized' } )
    }
    
    const token = auth.split( ' ' )[ 1 ]

    try {
        req.user = jwt.verify( token, SECRET )
        next()
    } catch( e ) {
        console.error( 'JWT error: ', e)
        res.status( 401 ).json( { message: 'Unauthorized: Invalid token' } )
    }
}