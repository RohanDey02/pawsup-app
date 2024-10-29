/*
  This is where we implement the queries. Some queries include signup POST and signin POST.
*/

const express = require('express');
const bookingRouter = express.Router();

// MongoDB Models
const Listing = require('../models/Listing');

// BOOKINGS:

// Make Booking
bookingRouter.put('/makeBooking', (req, res) => {
    let { listingowner, reason, cost, startdate, enddate } = req.body;

    listingowner = listingowner.trim();
    reason = reason.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    var tempstartdate = startdate.substring(0,10);
    startdate = tempstartdate;

    var tempenddate = enddate.substring(0,10);
    enddate = tempenddate;
    
    // Converting to Date Format
    var s1 = startdate.split("-");
    var e1 = enddate.split("-");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    var book = { reason: reason, cost: cost, startdate: startdate, enddate: enddate };

    if (listingowner == "" || reason == "" || cost < 0 || startdate == "" || enddate == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Fields!"
        })
    } else if(enddate1 < startdate1) {
        res.json({
            status: "FAILED",
            message: "Error: End Date is before Start Date"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get Listing Data
        Listing.find(query).then(info => {
            if (info.length) {
                // User exists, now check if date is blocked
                var bool = false;

                // Iterate through all of the dates
                for(const booking of info[0].bookings) {
                    var d1 = booking.startdate.split("-");
                    var d2 = booking.enddate.split("-");

                    var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                    var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);

                    // Check for overlapping
                    if((startdate1 >= from && startdate1 <= to) || (enddate1 >= from && enddate1 <= to) || (from >= startdate1 && from <= enddate1) || (to >= startdate1 && to <= enddate1)){
                        bool = true;
                        break;
                    }
                }

                if(bool == false){
                    info[0].bookings.push(book);

                    // Updates listing's information
                    Listing.updateOne(query, info[0]).then(doc => {
                        if (!doc) {
                            res.json({
                                status: "FAILED",
                                message: "Error: Could Not Find Listing"
                            })
                        } else {
                            Listing.find(query).then(data =>
                                res.json({
                                    status: "SUCCESS",
                                    message: "Listing Booking Added Successfully",
                                    data: data
                                })
                            )
                        }
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Error: Checking for Existing Listing #2"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: Dates Are Blocked Off Or Already Taken"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Error: Invalid Credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing #1"
            })
        })
    }
});

// Check bookings of a listing
bookingRouter.put('/checkBookings', (req, res) => {
    let listingowner = req.body.listingowner;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;

    listingowner = listingowner.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    var tempstartdate = startdate.substring(0,10);
    startdate = tempstartdate;

    var tempenddate = enddate.substring(0,10);
    enddate = tempenddate;

    // Converting to Date Format
    var s1 = startdate.split("-");
    var e1 = enddate.split("-");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    console.log(startdate1);
    console.log(enddate1);

    if (listingowner == "" || startdate == "" || enddate == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Booking Search Fields!"
        })
    } else if(enddate1 < startdate1) {
        res.json({
            status: "FAILED",
            message: "Error: End Date is before Start Date"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get Listing Data
        Listing.find(query).then(info => {
            if (info.length) {
                // User exists, now check if date is blocked
                var bool = false;

                // Iterate through all of the dates
                for(const booking of info[0].bookings) {
                    var d1 = booking.startdate.split("-");
                    var d2 = booking.enddate.split("-");

                    var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                    var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);

                    // Check for overlapping
                    if((startdate1 >= from && startdate1 <= to) || (enddate1 >= from && enddate1 <= to) || (from >= startdate1 && from <= enddate1) || (to >= startdate1 && to <= enddate1)){
                        bool = true;
                        break;
                    }
                }

                if(bool == false){
                    res.json({
                        status: "SUCCESS",
                        message: "EMPTY"
                    })
                } else {
                    res.json({
                        status: "SUCCESS",
                        message: "FULL"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Error: Invalid Credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing"
            })
        })
    }
})

function getDifferenceInDays(date1, date2) {
    const diffInMs = date2 - date1;
    return diffInMs / (1000 * 60 * 60 * 24);
}

// Cancelling Booking
bookingRouter.put('/cancelBooking', (req, res) => {
    // Listingowner, startdate and enddate gets passed in to find owner and exact appointment
    let { listingowner, startdate, enddate } = req.body;

    listingowner = listingowner.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("-");
    var e1 = enddate.split("-");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    if (listingowner == "" || startdate == "" || enddate == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Fields!"
        })
    } else if (enddate1 < startdate1) {
        res.json({
            status: "FAILED",
            message: "Error: End Date is before Start Date"
        })
    } else if (getDifferenceInDays(new Date(), startdate1) < 2) {
        res.json({
            status: "FAILED",
            message: "Error: Start Date is within 2 days of current time"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get Listing Data
        Listing.find(query).then(info => {
            if (info.length) {
                // User exists, now check if date is same as passed

                var bookings = info[0].bookings;
                var filtered = bookings.filter(function(value, index, arr) {
                    var d1 = value.startdate.split("-");
                    var d2 = value.enddate.split("-");

                    var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                    var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);

                    console.log(value);
                    return !((getDifferenceInDays(startdate1, from) == 0) && (getDifferenceInDays(enddate1, to) == 0));
/*                  Can use bare string comparison as well since data passed in and data stored has
                    consistent format, but will convert date and use function to get difference instead.
                    return !((value.startdate == startdate) && (value.enddate == enddate));
 */                });

                if (bookings.length != filtered.length) {
                    info[0].bookings = filtered;
                    Listing.updateOne(query, info[0]).then(doc => {
                        if (!doc) {
                            res.json({
                                status: "FAILED",
                                message: "Error: Could Not Find Listing"
                            })
                        } else {
                            Listing.find(query).then(data =>
                                res.json({
                                    status: "SUCCESS",
                                    message: "Listing Booking Removed Successfully",
                                    data: data
                                })
                            )
                        }
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Error: Checking for Existing Listing #2"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: No appointment matched specified startdate and enddate"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Error: Invalid Credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing #1"
            })
        })
    }
});

// Get Appointments that petowner booked
bookingRouter.get('/getPetownerBookings', (req, res) => {
    let petowner = req.query.petowner;

    if (petowner == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Owner Field!"
        })
    } else {
        var AllBookings = [];
        // Get listing data for bookings
        Listing.find().then(data => {
            for (const listing of data) {
                filtered = listing.bookings.filter(function(value, index, arr) {
                    return (value.reason == petowner);
                })
                if (filtered.length > 0) {
                    listing.bookings = filtered;
                    AllBookings.push(listing);
                }
            }
            res.json({
                status: "SUCCESS",
                message: "Bookings Found Successfully",
                data: AllBookings
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding Bookings, Perhaps User has no bookings"
            })
        })
    }
});

// Get previous appointments for petowner
bookingRouter.get('/getPreviousBookings', (req, res) => {
    let petowner = req.query.petowner;

    petowner = petowner.trim();

    if (petowner == "") {
        res.json({
            status: "FAILED",
            message: "Error: Invalid fields"
        })
        return;
    }

    Listing.find({"bookings.reason": petowner}).then(data => {
        var previousBookings = [];
        for (var listing of data) {
            console.log(listing.title);
            var rating = listing.sumRatings/listing.numRatings;
            filtered = listing.bookings.filter(function(value, index, arr) {
                var d2 = value.enddate.split("-");

                var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
                console.log(value.reason, getDifferenceInDays(new Date(), to));
                // Finds all elements in which the enddate is past current data
                return ((value.reason == petowner) && (getDifferenceInDays(new Date(), to) < 0));
            })
            if (filtered.length > 0) {
                for (var booking in filtered) {
                    var newVal = JSON.parse(JSON.stringify(filtered[booking]));     // Deep copy of altered booking
                    newVal.reason = listing.listingowner;
                    newVal.rating = rating;
                    previousBookings.push(newVal);
                }
            }
        }
        if (previousBookings.length > 0) {
            res.json({
                status: "SUCCESS",
                message: "Previous appointments found successfully",
                data: previousBookings
            })
        } else {
            res.json({
                status: "FAILED",
                message: "No previous appointments found"
            })
            return;
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "Error: Finding Bookings, Perhaps User has no bookings"
        })
    })
});

module.exports = bookingRouter;
