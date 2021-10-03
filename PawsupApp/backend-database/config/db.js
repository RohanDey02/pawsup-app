/*
  This connects the server to MongoDB using the Mongoose import and MONGODB_URI
*/

require('dotenv').config(); // In order to access ENV variables
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected");
}).catch((err) => console.log(err));