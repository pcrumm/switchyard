var controller = {
    another: { }
}

var verbs = [ 'get', 'post', 'patch', 'put', 'delete' ];

verbs.forEach( function( verb ) {
    controller.another[ verb ] = function( req, res ) {
        res.send( verb );
    }
} );

module.exports = controller;
