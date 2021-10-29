/*
  This is where we implement the queries. Some queries include signup POST and signin POST. 
*/

const express = require('express');
const router = express.Router();

// MongoDB Models
const User = require('../models/User');
const Listing = require('./../models/Listing');

// Password Encrypter
const bcrypt = require('bcrypt');

// USER:

// Signup
router.post('/signup', (req, res) => {
    let { email, password, fullname, dateofbirth, location, phonenumber, accounttype, pettype } = req.body;

    email = email.trim();
    password = password.trim();
    fullname = fullname.trim();
    dateofbirth = dateofbirth.trim();
    location = location.trim();
    phonenumber = phonenumber.trim();
    accounttype = accounttype.trim();
    pettype = pettype.trim();

    if (email == "" || password == "" || fullname == "" || dateofbirth == "" || location == "" || phonenumber == "" || accounttype == "" || pettype == "") {
        res.json({
            status: "FAILED",
            message: "Empty fields!"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!",
        });
    } else if (!/^[a-zA-Z ]*$/.test(fullname)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!new Date(dateofbirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered",
        });
    } else if (!/^(\d{1,}[a-zA-z]{0,1})+(\s)+[0-9A-Za-z\s]+[A-z]+[a-z]+(\,\s)+[A-Z]+[a-z\s]+(\,\s)+[A-Za-z]{2,}(\,\s)+[A-Z][\d][A-Z][\d][A-Z][\d]*$/.test(location)) {
        res.json({
            status: "FAILED",
            message: "Invalid location entered",
        });
    } else if (!/^[\d]{10}$/.test(phonenumber)) {
        res.json({
            status: "FAILED",
            message: "Invalid phone number entered",
        });
    } else if (!(/^(Petowner|Petsitter)$/.test(accounttype))) {
        res.json({
            status: "FAILED",
            message: "Invalid account type entered",
        });
    } else if (!/^[a-zA-Z ]*$/.test(pettype)) {
        res.json({
            status: "FAILED",
            message: "Invalid pet type entered",
        });
    } else {
        // Check if User already exists
        User.find({ email }).then(result => {
            if (result.length) {
                // User exists
                res.json({
                    status: "FAILED",
                    message: "User already exists"
                })
            } else {
                // Create user
                var dob = dateofbirth.substring(0,10);
                dateofbirth = dob;

                // Password Handler
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        email,
                        password,
                        fullname,
                        dateofbirth,
                        location,
                        phonenumber,
                        accounttype,
                        pettype
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup Successful",
                            data: result,
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Error: Saving User"
                        })
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error: Hashing password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for existing user"
            })
        })
    }
});

// Signin
router.post('/signin', (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        // Check if User exists
        User.find({email}).then(data => {
            if (data.length) {
                // User exists
                const hashedPassword = data[0].password;
                if(password == hashedPassword){
                    res.json({
                        status: "SUCCESS",
                        message: "Signin Successful",
                        data: data
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: Invalid Password"
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
                message: "Error: Checking for Existing User"
            })
        })
    }
});

// Get user info
router.get('/getUser', (req, res) => {
    let email = req.query.email;

    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Email Field!"
        })
    } else {
        var query = { email: email };

        // Get listing data for bookings
        User.find(query).then(data => {
            res.json({
                status: "SUCCESS",
                message: "User Found Successfully",
                data: data
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding User, Perhaps Doesn't Exist"
            })
        })
    }
});

// Update
router.put('/update', (req, res) => {
    let { email, password, pettype } = req.body;

    email = email.trim();
    password = password.trim();
    pettype = pettype.trim();

    if (email == "" || password == "" || pettype == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        var conditions = { email: email };

        // Updates user's password and/or found by email
        User.updateOne(conditions, req.body).then(doc => {
            if (!doc) {
                res.json({
                    status: "FAILED",
                    message: "Error could not find user"
                })
            } else {
                User.find(conditions).then(data =>
                    res.json({
                        status: "SUCCESS",
                        message: "Update Successful",
                        data: data
                    })
                )
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing User"
            })
        })
    }
});

// LISTING:

// Create Listing
router.post('/createListing', (req, res) => {
    let { listingowner } = req.body;
    var emptyString = "Not Filled Out Yet";
    var emptyNumber = -1;
    var emptyArray = [];

    listingowner = listingowner.trim();
    emptyString = emptyString.trim();

    if (listingowner == "") {
        res.json({
            status: "FAILED",
            message: "Empty field!"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(listingowner)) {
        res.json({
            status: "FAILED",
            message: "Invalid listing owner entered",
        });
    } else {
        // Check if Listing already exists
        Listing.find({ listingowner }).then(result => {
            if (result.length) {
                // Listing exists
                res.json({
                    status: "FAILED",
                    message: "Listing already exists"
                })
            } else {
                // Create listing
                const newListing = new Listing({
                    listingowner: listingowner,
                    title: emptyString,
                    description: emptyString,
                    location: emptyString,
                    features: emptyString,
                    price: emptyNumber,
                    sumRatings: 1,
                    numRatings: 1,
                    rating: 1,
                    bookings: emptyArray
                });

                newListing.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Listing Creation Successful",
                        data: result,
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Error: Saving New Listing"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for existing listing"
            })
        })
    }
});

// Get Listing
router.get('/getListing', (req, res) => {
    let listingowner = req.query.listingowner;

    if (!(listingowner)) {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Owner Field!"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get listing data for bookings
        Listing.find(query).then(data => {
            res.json({
                status: "SUCCESS",
                message: "Listing Found Successfully",
                data: data
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding Listing, Perhaps Doesn't Exist"
            })
        })
    }
});

// Modify Listing
router.put('/modifyListing', (req, res) => {
    let { listingowner, title, description, location, features, price } = req.body;

    listingowner = listingowner.trim();
    title = title.trim();
    description = description.trim();
    location = location.trim();
    features = features.trim();

    if (listingowner == "" || title == "" || description == "" || location == "" || features == "" || price < 0) {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Fields!"
        })
    } else if (!/^(\d{1,}[a-zA-z]{0,1})+(\s)+[0-9A-Za-z\s]+[A-z]+[a-z]+(\,\s)+[A-Z]+[a-z\s]+(\,\s)+[A-Za-z]{2,}(\,\s)+[A-Z][\d][A-Z][\d][A-Z][\d]*$/.test(location)) {
        res.json({
            status: "FAILED",
            message: "Invalid location entered",
        });
    } else {
        var query = { listingowner: listingowner };

        // Get listing data for bookings
        Listing.find(query).then(info => {
            req.body.bookings = info[0].bookings

            // Updates listing's information
            Listing.updateOne(query, req.body).then(doc => {
                if (!doc) {
                    res.json({
                        status: "FAILED",
                        message: "Error: Could Not Find Listing"
                    })
                } else {
                    Listing.find(query).then(data =>
                        res.json({
                            status: "SUCCESS",
                            message: "Listing Modification Successful",
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
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Listing #1"
            })
        })
    }
});

// Make Booking
router.put('/makeBooking', (req, res) => {
    let { listingowner, reason, cost, startdate, enddate } = req.body;

    listingowner = listingowner.trim();
    reason = reason.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("/");
    var e1 = enddate.split("/");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    var tempstartdate = startdate.substring(0,10);
    startdate = tempstartdate;

    var tempenddate = enddate.substring(0,10);
    enddate = tempenddate;

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
                    var d1 = booking.startdate.split("/");
                    var d2 = booking.enddate.split("/");

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

// Filter Listing By Price
router.get('/filterPriceListings', (req, res) => {
    let minprice = req.query.minprice;
    let maxprice = req.query.maxprice;
    var listingowners = [];

    if(minprice < 0 || maxprice < 0){
        res.json({
            status: "FAILED",
            message: "Error: Entering prices below 0!"
        })
    } else{
        Listing.find({} , (err, listings) => {
            if(err){
                res.json({
                    status: "FAILED",
                    message: "Error: Finding Listings"
                })
            } else{
                listings.map(listing => {
                    // Check the listing price to see if it works
                    if(listing.price >= minprice && listing.price <= maxprice){
                        listingowners.push(listing.listingowner);
                    }
                })
    
                res.json({
                    status: "SUCCESS",
                    message: "Listing Owners With Suitable Price Found Successfully",
                    data: listingowners
                })
            }
        })  
    }
});

// Filter Listing By Availability
router.get('/filterAvailabilityListings', (req, res) => {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    var listingowners = [];

    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("/");
    var e1 = enddate.split("/");
    var startdate1 = new Date(s1[0], parseInt(s1[1])-1, s1[2]);
    var enddate1 = new Date(e1[0], parseInt(e1[1])-1, e1[2]);

    if(enddate1 < startdate1){
        res.json({
            status: "FAILED",
            message: "Error: End Date is before Start Date"
        })
    } else{
        Listing.find({} , (err, listings) => {
            if(err){
                res.json({
                    status: "FAILED",
                    message: "Error: Finding Listings"
                })
            } else{
                listings.map(listing => {
                    // Check the listing availability to see if it works
                    var bool = false;
                    // Iterate through all of the dates
                    for(const booking of listing.bookings) {
                        var d1 = booking.startdate.split("/");
                        var d2 = booking.enddate.split("/");

                        var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                        var to = new Date(d2[0], parseInt(d2[1])-1, d2[2]);

                        // Check for overlapping
                        if((startdate1 >= from && startdate1 <= to) || (enddate1 >= from && enddate1 <= to) || (from >= startdate1 && from <= enddate1) || (to >= startdate1 && to <= enddate1)){
                            bool = true;
                            break;
                        }
                    }

                    if(bool == false){
                        listingowners.push(listing.listingowner);
                    }
                })
    
                res.json({
                    status: "SUCCESS",
                    message: "Listing Owners With Suitable Availability Found Successfully",
                    data: listingowners
                })
            }
        })  
    }
});

function getDifferenceInDays(date1, date2) {
    const diffInMs = date2 - date1;
    return diffInMs / (1000 * 60 * 60 * 24);
}

// Cancelling Booking
router.put('/cancelBooking', (req, res) => {
    // Listingowner, startdate and enddate gets passed in to find owner and exact appointment
    let { listingowner, startdate, enddate } = req.body;

    listingowner = listingowner.trim();
    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("/");
    var e1 = enddate.split("/");
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
                    var d1 = value.startdate.split("/");
                    var d2 = value.enddate.split("/");

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
router.get('/getPetownerBookings', (req, res) => {
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

router.get('/sortListings', (req, res) => {
    let sortVal = req.query.sortVal;
    let order = req.query.order;

    // Rejects if sortVal not title, cost, rating, description or feature, or order not asc or desc
    if (((sortVal == "title") || (sortVal == "cost") || (sortVal == "rating")  || (sortVal == "description")  || (sortVal == "features")) && ((order == "asc") || order == "desc")) {
        // Sets order to equivalent number value for mongo sorting
        order = (order == "asc") ? 1 : -1;
        switch (sortVal) {
        case "rating" :
            Listing.aggregate([{
                $addFields: { 
                // Creates temporary field to calculate rating of Listing
                rating: {
                    $divide:["$sumRatings", "$numRatings"] 
                }}}, { $sort: {"rating": order } }
                ]).then(data => {
                    res.json({
                        status: "SUCCESS",
                        message: "Listings sorted by rating",
                        data: data
                    })
                })
            break;
        case "cost":
            Listing.aggregate([{
                $addFields: { 
                // Creates temporary field to calculate rating of Listing
                rating: {
                    $divide:["$sumRatings", "$numRatings"] 
                }}}, { $sort: {"price": order } }
                ]).then(data => {
                res.json({
                    status: "SUCCESS",
                    message: "Listings sorted by cost",
                    data: data
                })
            })
            break;
        case "title":
            Listing.aggregate([{
            $addFields: { 
            // Creates temporary field to calculate rating of Listing
            rating: {
                $divide:["$sumRatings", "$numRatings"] 
            }}}, { $sort: {"price": order } }
            ]).then(data => {
                res.json({
                    status: "SUCCESS",
                    message: "Listings sorted by title",
                    data: data
                })
            })
            break;
        case "description":
            Listing.aggregate([{
            $addFields: { 
            // Creates temporary field to calculate rating of Listing
            rating: {
                $divide:["$sumRatings", "$numRatings"] 
            }}}, { $sort: {"price": order } }
            ]).then(data => {
                res.json({
                    status: "SUCCESS",
                    message: "Listings sorted by description",
                    data: data
                })
            })
            break;
        case "features":
            Listing.aggregate([{
            $addFields: { 
            // Creates temporary field to calculate rating of Listing
            rating: {
                $divide:["$sumRatings", "$numRatings"] 
            }}}, { $sort: {"price": order } }
            ]).then(data => {
                res.json({
                    status: "SUCCESS",
                    message: "Listings sorted by features",
                    data: data
                })
            })
            break;
        }
    } else {
        res.json({
            status: "FAILED",
            message: "Error: Incorrect sort item!",
            data: req.query
        })
    }
});

module.exports = router;