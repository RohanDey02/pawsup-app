/*
  User.js model is to tell MongoDB how each User must be modelled.
  Essentially, this is just defining the User class.  
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PreviouslyOrderedSchema = new Schema({
  name: String,
  price: Number,
  image: String,
  quantity: Number,
  rating: Number
})

const UserSchema = new Schema({
    email: String,
    password: String,
    fullname: String,
    dateofbirth: String,
	  location: String,
    phonenumber: String,
    accounttype: String,
    pettype: String,
    previousorders: [PreviouslyOrderedSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;