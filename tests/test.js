var request     = require( 'supertest' ),
    should      = require( 'should' ),
    _           = require( 'lodash' );

describe( 'Switchyard', function() {
    // Functional tests verify the correct behavior of the library as far
    // as the end-user is concerned.
    describe( 'Functional Tests', function() {
        // Start up an expressjs server to use for the tests
        before( function( done ) {
            test_server = require( './sample-application/server.js' );
            done();
        } );

        after( function( done ) {
            test_server.close( done );
        } );

        var base_url = 'http://localhost:40595';
        var http_verbs = [ 'get', 'post', 'patch', 'put', 'delete' ];

        describe( 'Dynamic routing', function() {
            // Make sure index routes function
            it( 'should properly route an index route', function( done ) {
                request( base_url ).get( '/test' ).end( function( e, r ) {
                    r.text.should.equal( 'WORKS' );
                    done();
                } );
            } );

            // Make sure one endpoint can reply to multiple verbs
            it( 'should allow endpoints to respond to multiple verbs', function( done ) {
                request( base_url ).get( '/test/testing' ).end( function( e , r ) {
                    r.text.should.equal( 'WORKING' );

                    request( base_url ).post( '/test/testing' ).end( function( e, r ) {
                        r.text.should.equal( 'SUCCESS' );
                        done();
                    } );
                } );
            } );

            // Make sure every HTTP verb works
            http_verbs.forEach( function( verb ) {
                it( 'should respond to ' + verb + ' requests', function( done ) {
                    request( base_url )[ verb ]( '/other-test/another' ).end( function( e, r ) {
                        r.text.should.equal( verb );
                        done();
                    } );
                } );
            } );

            // Make sure named routes work
            it( 'should respond to named routes and properly bind the parameter', function( done ) {
                request( base_url ).get( '/test/named/phil' ).end( function( e, r ) {
                    r.text.should.equal( 'hello phil' );
                    done();
                } );
            } );
        } );

        describe( 'Route aliases', function() {
            var route_aliases = require( './sample-application/route-aliases' );
            /**
             * To test route aliases, we'll scan over each HTTP verb and alias
             * and ensure the responses match for each.
             */
            _.forOwn( route_aliases, function( true_route, alias_route ) {
                http_verbs.forEach( function( verb ) {
                    it( 'should match ' + verb + ' output for alias ' + alias_route + ' => ' + true_route, function( done ) {
                        request( base_url )[ verb ]( true_route ).end( function( e_true, r_true ) {
                            request( base_url )[ verb ]( alias_route ).end( function( e_alias, r_alias ) {
                                // We use the should( ) syntax as the response may be null
                                // We also need to replace the path in each response as that won't match...
                                should( e_true ).equal( e_alias );
                                should( r_true.text.replace( true_route, '%%PATH%%' ) ).equal( r_alias.text.replace( alias_route, '%%PATH%%' ) );
                                should( r_true.statusCode ).equal( r_alias.statusCode );
                                done();
                            } );
                        } );
                    } );
                } );
            } );
        } );
    } );
} );
