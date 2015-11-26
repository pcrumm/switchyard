# switchyard
[![npm version](https://badge.fury.io/js/switchyard.svg)](https://badge.fury.io/js/switchyard)

Dynamic routing library for express.js

## The Problem
express.js makes development of RESTful applications a cinch. Unfortunately, it makes ugly application organization a cinch as well. How often have you seen single-page express.js applications that end up as route soup?

```javascript
// bad-application.js
app.get( '/endpoint', function() { ... } );
app.post( '/endpoint', function() { ... } );
app.get( '/another-endpoint', function() { ... } );
app.patch( '/some-endpoint/:id', function() { ... } );
```

As applications grow, they sometimes become more organized. The tight coupling between routes and controllers remains, however; to locate the function that defines a route, you'll need to search the entire codebase.

Enter switchyard. switchyard performs dynamic routing based on controller structure. Your code now defines its routes implicitly, and simple separation of controllers is simple.

## Installation
To install switchyard, just require it from npm:

```
npm install --save switchyard
```

## Usage
Using switchyard is simple. Place your controllers in one director (we'll use `controllers` for our examples). A simple example server:

```
var app = require( 'express' )();
var switchyard = require( 'switchyard' );

// Starting switchyard is simple. Pass your express.js instance as the first
// parameter, and the full path to your controller directory as the second.
switchyard( app, __dirname + '/controllers' );

var server = app.listen( 3000, function() {
    console.log( 'A switchyard-powered express server is running on port 3000!' );
} );
```

## Controller Syntax
Controllers are placed in your defined controller directory (the second parameter to `switchyard`). Their URL routes are generated by their name; for example, to create a controller that responds to endpoints beginning with `/user`, name your controller `user.js`. Controllers expose a single object that defines their behavior.

```javascript
// controllers/user.js
module.exports = {
    // Endpoints that respond to /user/hello
    hello: {
        // GET /user/hello
        get: function( req, res ) {
            res.send( 'Hello, world!' );
        }
    }
};
```

These objects are two dimensional. The first dimension is the endpoint name (which will be reflected directly in the URL, as the comments above indicate). The second dimension controls the response to each HTTP verb, and returns a function that maps directly to an express.js route that defines the behavior. Every HTTP verb that express supports is supported here: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, etc.

### Special endpoint names
If you'd like to map directly to the `/` route for a controller (for example, `/user/`), you can used the `index` route.

```javascript
// controllers/test.js
module.exports = {
    // Endpoints that respond to /test/
    index: {
        // POST /test
        post: function( req, res ) {
            // ... do something
        }
    }
};
```

You can also use named routes, e.g. `/user/view/:id`.

```javascript
// controllers/user.js
module.exports = {
    "view/:id": {
        get: function( req, res ) {
            var user_id = req.param( 'id' );
            res.send( 'Hello, user ' + user_id + '!' );
        }
    }
};
```

## Contributing
Pull requests are gladly appreciated! You are also free to create issues for feature requests, bugs, or to complain about this documentation.
