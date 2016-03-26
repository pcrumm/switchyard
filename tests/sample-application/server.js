var app = require( 'express' )();
var switchyard = require( './../../lib/switchyard.js' );

switchyard( app, __dirname + '/controllers', require( './route-aliases.js' ) );

module.exports = app.listen( 40595, function() { } );
