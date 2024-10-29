/*
  How to send test data to MongoDB
  1) Run "node server.js" in backend-database folder
  2) On Postman, POST/Do Command on http://localhost:8080/api in JSON format
  3) You're good to go!

  The server is hosted on Heroku via: pawsupdev@gmail.com
  Heroku Link: https://protected-shelf-96328.herokuapp.com/api

  On Heroku, everything is already running. You can test this with Postman with your command on:
    - https://protected-shelf-96328.herokuapp.com/api/signin
    - https://protected-shelf-96328.herokuapp.com/api/signup
  Then you're good to go!
*/

// MongoDB
require("./config/db");

const app = require("express")();
const port = process.env.PORT || 8080;

//cors
const cors = require("cors");
app.use(cors());

const bookingRouter = require("./routers/BookingRouter");
const listingRouter = require("./routers/ListingRouter");
const paymentsRouter = require("./routers/PaymentsRouter");
const storeRouter = require("./routers/StoreRouter");
const userRouter = require("./routers/UserRouter");

// For accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});