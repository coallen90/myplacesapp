// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlaceSchema   = new Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Place', PlaceSchema);