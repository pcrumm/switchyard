module.exports = {
    'named/:id': {
        get: function( req, res ) {
            res.send( 'hello ' + req.params.id );
        }
    },

    index: {
        get: function( req, res ) {
            res.send( 'WORKS' );
        }
    },

    testing: {
        get: function( req, res ) {
            res.send( 'WORKING' );
        },
        post: function( req, res ) {
            res.send( 'SUCCESS' );
        }
    }
}
