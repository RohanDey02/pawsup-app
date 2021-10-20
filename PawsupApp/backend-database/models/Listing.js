/*
  Listing.js model is to tell MongoDB how each Listing must be modelled.
  Essentially, this is just defining the Listing class.  
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookedSchema = new Schema({
    reason: String,
	cost: Number,
    startdate: String,
    enddate: String
});

const ListingSchema = new Schema({
    listingowner: String,
    title: String,
    description: String,
	location: String,
    features: String,
	price: Number,
    bookings: [BookedSchema]
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;