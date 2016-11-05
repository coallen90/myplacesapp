// server.js

// https://devcenter.heroku.com/articles/mongolab
// http://todomvc.com/examples/angularjs/#/
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

var Place     = require('./app/models/place');

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

  .get('/api/places', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Todo.find( function ( err, places ){
      res.json(200, places);
    });
  })

  .post('/api/places', function (req, res) {
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

  .get('/api/places/:place_id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Place.findById(req.params.place_id, function(err, place) {
            if (err)
                res.send(err);
            res.json(place);
        });
  })

  .put('/api/places/:place_id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
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

  .del('/api/places/:place_id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Place.remove({
            _id: req.params.place_id
        }, function(err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);