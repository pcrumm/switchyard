var _ = require( 'lodash' );

/**
 * Dynamically create express.js routes based upon defined controllers.
 *
 * @param express app Express application to bound the routes to
 * @param string controller_path Location of the controllers to examine.
 * @param object route_aliases A map of route aliases, where the key is the alias and the value is the real path.
 */
var define_routes = function( app, controller_path, route_aliases ) {
    route_aliases = route_aliases || {};
    var route_alias_map = generate_route_map( route_aliases );

    // Ensure that the controller path ends in '/' to make things easier later.
    controller_path = normalize_controller_path( controller_path );

    // Find all possible controller files
    var controller_files = find_controllers( controller_path );


    var routes = [];
    // Iterate through each controller file and find its endpoints
    controller_files.forEach( function( controller_file ) {
        var _controller = require( controller_path + controller_file );
        var endpoints = _.keys( _controller );

        var endpoint_path = '/' + controller_name_from_filename( controller_file ) + '/';

        // For each endpoint, determine what verbs are supported and map them appropriately
        endpoints.forEach( function( endpoint ) {
            // If this is the "index" method, we map it to the path directly.
            var endpoint_suffix = ( endpoint === 'index' ) ? '' : endpoint;
            var endpoint_url = endpoint_path + endpoint_suffix;

            // Normalize every endpoint_url by removing any trailing slashes
            if( endpoint_url[ endpoint_url.length - 1 ] == '/' ) {
                endpoint_url = endpoint_url.substr( 0, endpoint_url.length - 1 );
            }

            // Next, figure out what verbs we apply to this endpoint.
            _.keys( _controller[ endpoint ] ).forEach( function( verb ) {
                var endpoint_routes = [];

                // First, apply the directly matching route
                var route_details = {
                    verb: verb,
                    url: endpoint_url,
                    name: endpoint,
                    controller: _controller
                };
                endpoint_routes.push( route_details );

                // Check to see if there are any aliases that map to this endpoint
                if ( route_alias_map[ endpoint_url ] !== undefined ) {
                    route_alias_map[ endpoint_url ].forEach( function( aliased_url ) {
                        var alias_route_details = {
                            verb: verb,
                            url: aliased_url,
                            name: endpoint,
                            controller: _controller
                        };

                        endpoint_routes.push( alias_route_details );
                    } );
                }

                // Apply all routes that match this endpoint, including aliases
                endpoint_routes.forEach( function( route_details ) {
                    // Wildcard routes (those containing :) need to be applied last
                    // or else they'll override more specific routes. To do that,
                    // we'll add them to the end of our list
                    if ( route_details.url.indexOf( ':' ) !== -1 ) {
                        routes.push( route_details );
                    } else {
                        routes.unshift( route_details );
                    }
                } );
            } );
        } );
    } );

    // Now that we've found every route, let's apply them
    routes.forEach( function( route ) {
        app[ route.verb ]( route.url, route.controller[ route.name ][ route.verb ] );
    } );
};

// The route-defining operation is publicly accessible.
module.exports = define_routes;

/**
 * Search for the defined controllers in the designated path.
 *
 * @param string path The path to search for controllers
 * @param array A list of available controllers.
 */
var find_controllers = function( path ) {
    var fs = require( 'fs' );

    var possible_controller_files = fs.readdirSync( path );
    var controller_files = [];

    // readdir returns directories as well, so let's remove those.
    possible_controller_files.forEach( function( file ) {
        if ( fs.statSync( path + file ).isFile() ) {
            controller_files.push( file );
        }
    } );

    return controller_files;
}

/**
 * Determine a controller's name from its filename.
 *
 * @param string filename Controller's filename
 * @return string The correct name for the controller for URLs
 */
var controller_name_from_filename = function( filename ) {
    return filename.substr( 0, filename.indexOf( '.js' ) );
}

/**
 * Ensure that the controller path always ends in a slash, for consistent
 * operation later.
 *
 * @param string path The defined controller path
 * @return string The normalized controller path
 */
var normalize_controller_path = function( path ) {
    return path.substring( -1 ) === '/' ? path : ( path + '/' );
}

/**
 * Generate a usable route map from our route alias list.
 * The goal of this format is to expedite alias lookups for a given
 * endpoint.
 */
var generate_route_map = function( route_aliases ) {
    var route_map = {};

    _.forOwn( route_aliases, function( true_route, aliased_route ) {
        // Let's make sure that each route is '/' prefixed, so matching works later...
        if( true_route[0] != '/' ) {
            true_route = '/' + true_route;
        }

        if( aliased_route[0] != '/' ) {
            aliased_route = '/' + aliased_route;
        }

        if( true_route in route_map ) {
            route_map[ true_route ].push( aliased_route );
        } else {
            route_map[ true_route ] = [ aliased_route ];
        }
    } );

    return route_map;
}
