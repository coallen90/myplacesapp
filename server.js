/*// server.js

// BASE SETUP
// =============================================================================

var Place     = require('./app/models/place');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/negozio'); // connect to our database

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
// on routes that end in /places
// ----------------------------------------------------
router.route('/places')

    // create a place (accessed at POST http://localhost:8080/api/places)
    .post(function(req, res) {
        
        var place = new Place();
        place.name = req.body.name;
        place.description = req.body.description;

        // save the place and check for errors
        place.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Place created!' });
        });
        
    })

    // get all the places (accessed at GET http://localhost:8080/api/places)
    .get(function(req, res) {
        Place.find(function(err, places) {
            if (err)
                res.send(err);

            res.json(places);
        });
    });


// on routes that end in /places
// ----------------------------------------------------
router.route('/places')

// on routes that end in /places/:place_id
// ----------------------------------------------------
router.route('/places/:place_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/places/:place_id)
    .get(function(req, res) {
        Place.findById(req.params.place_id, function(err, place) {
            if (err)
                res.send(err);
            res.json(place);
        });
    })

    // update the place with this id (accessed at PUT http://localhost:8080/api/places/:place_id)
    .put(function(req, res) {

        // use our place model to find the bear we want
        Place.findById(req.params.place_id, function(err, place) {

            if (err)
                res.send(err);

            place.name = req.body.name;  // update the place info
            place.description = req.body.description;

            // save the place
            place.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Place updated!' });
            });

        });
    })

    // delete the place with this id (accessed at DELETE http://localhost:8080/api/place/:place_id)
    .delete(function(req, res) {
        Place.remove({
            _id: req.params.place_id
        }, function(err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);*/

// https://devcenter.heroku.com/articles/mongolab
// http://todomvc.com/examples/angularjs/#/
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

    // Mongoose Schema definition
    PlaceSchema = new mongoose.Schema({
      id       : String,
      name: String,
      description: String
    }),

    Place = mongoose.model('Place', PlaceSchema);

/*
 * I’m sharing my credential here.
 * Feel free to use it while you’re learning.
 * After that, create and use your own credential.
 * Thanks.
 *
 * MONGOLAB_URI=mongodb://example:example@ds053312.mongolab.com:53312/todolist
 * 'mongodb://example:example@ds053312.mongolab.com:53312/todolist'
 */
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

express()
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
  })

  .get('/api/todos', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Todo.find( function ( err, todos ){
      res.json(200, todos);
    });
  })

  .post('/api/todos', function (req, res) {
    var todo = new Todo( req.body );
    todo.id = todo._id;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    todo.save(function (err) {
      res.json(200, todo);
    });
  })

  .del('/api/todos', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    Todo.remove({ completed: true }, function ( err ) {
      res.json(200, {msg: 'OK'});
    });
  })

  .get('/api/todos/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Todo.findById( req.params.id, function ( err, todo ) {
      res.json(200, todo);
    });
  })

  .put('/api/todos/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Todo.findById( req.params.id, function ( err, todo ) {
      todo.title = req.body.title;
      todo.completed = req.body.completed;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      todo.save( function ( err, todo ){
        res.json(200, todo);
      });
    });
  })

  .del('/api/todos/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Todo.findById( req.params.id, function ( err, todo ) {
      // http://mongoosejs.com/docs/api.html#model_Model.remove
      todo.remove( function ( err, todo ){
        res.json(200, {msg: 'OK'});
      });
    });
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);