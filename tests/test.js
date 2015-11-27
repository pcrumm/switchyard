var request     = require( 'supertest' ),
    should      = require( 'should' );

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

        var base_url = 'http://localhost:40595/';

        describe( 'Dynamic routing', function() {
            // Make sure index routes function
            it( 'should properly route an index route', function( done ) {
                request( base_url ).get( 'test' ).end( function( e, r ) {
                    r.text.should.equal( 'WORKS' );
                    done();
                } );
            } );

            // Make sure one endpoint can reply to multiple verbs
            it( 'should allow endpoints to respond to multiple verbs', function( done ) {
                request( base_url ).get( 'test/testing' ).end( function( e , r ) {
                    r.text.should.equal( 'WORKING' );

                    request( base_url ).post( 'test/testing' ).end( function( e, r ) {
                        r.text.should.equal( 'SUCCESS' );
                        done();
                    } );
                } );
            } );

            // Make sure every HTTP verb works
            var http_verbs = [ 'get', 'post', 'patch', 'put', 'delete' ];
            http_verbs.forEach( function( verb ) {
                it( 'should respond to ' + verb + ' requests', function( done ) {
                    request( base_url )[ verb ]( 'other-test/another' ).end( function( e, r ) {
                        r.text.should.equal( verb );
                        done();
                    } );
                } );
            } );

            // Make sure named routes work
            it( 'should respond to named routes and properly bind the parameter', function( done ) {
                request( base_url ).get( 'test/named/phil' ).end( function( e, r ) {
                    r.text.should.equal( 'hello phil' );
                    done();
                } );
            } );
        } );
    } );
} );
