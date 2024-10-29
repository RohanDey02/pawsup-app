/*
  This is where we implement the queries. Some queries include signup POST and signin POST.
*/

const express = require('express');
const listingRouter = express.Router();

// MongoDB Models
const Listing = require('../models/Listing');

// LISTING:

// Create Listing
listingRouter.post('/createListing', (req, res) => {
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
listingRouter.get('/getListing', (req, res) => {
    let listingowner = req.query.listingowner;

    if (!(listingowner)) {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing Owner Field!"
        })
    } else {
        var query = { listingowner: listingowner };

        // Get listing data for bookings
        Listing.aggregate([{ $match: query }, {
            $addFields: {
            // Creates temporary field to calculate rating of Listing
            rating: {
                $divide:["$sumRatings", "$numRatings"]
            }}}
            ]).then(data => {
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
listingRouter.put('/modifyListing', (req, res) => {
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

// Remove Listing
listingRouter.delete('/deleteListing', (req, res) => {
    let listingowner = req.query.listingowner;

    if (listingowner == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        var conditions = { listingowner: listingowner };

        // Removes Listing, if it exists, by its listing owner
        Listing.find(conditions).then(data => {
            Listing.deleteOne(conditions, req.body).then(doc => {
                if (doc.deletedCount < 1) {
                    res.json({
                        status: "FAILED",
                        message: "No Listing Was Deleted"
                    })
                } else {
                    res.json({
                        status: "SUCCESS",
                        message: "Listing Deleted Successfully",
                        data: data
                    })
                }
            });
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding Listing, Perhaps Doesn't Exist"
            })
        })
    }
});

// Filter Listing By Price
listingRouter.get('/filterPriceListings', (req, res) => {
    let minprice = parseInt(req.query.minprice);
    let maxprice = parseInt(req.query.maxprice);
    var listingowners = [];

    if(minprice < 0 || maxprice < 0){
        res.json({
            status: "FAILED",
            message: "Error: Entering prices below 0!"
        })
    } else if(minprice > maxprice){
        res.json({
            status: "FAILED",
            message: "Error: Minimum Price is Above Maximum Price!"
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
listingRouter.get('/filterAvailabilityListings', (req, res) => {
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    var listingowners = [];

    startdate = startdate.trim();
    enddate = enddate.trim();

    // Converting to Date Format
    var s1 = startdate.split("-");
    var e1 = enddate.split("-");
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

listingRouter.get('/sortListings', (req, res) => {
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
            }}}, { $sort: {"description": order } }
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

// Add rating for Listing
listingRouter.put('/addListingRating', (req, res) => {
    // Accepts rating from 1 - 5 for Luce's implementation
    let { listingowner, rating } = req.body;

    listingowner = listingowner.trim();

    if ((listingowner == "") || (!/^[1-5]$/.test(rating))) {
        res.json({
            status: "FAILED",
            message: "Error: Invalid fields"
        })
        return;
    }
    var query = { listingowner: listingowner };
    Listing.updateOne(query, { $inc: { numRatings: 1, sumRatings: rating/5 } }).then(data => {
        if (data.modifiedCount < 1) {
            res.json({
                status: "FAILED",
                message: "Error: rating modification failed",
                data: data
            })
        } else {
            Listing.aggregate([{ $match: query }, {
                $addFields: { 
                // Creates temporary field to calculate rating of Listing
                rating: {
                    $divide:["$sumRatings", "$numRatings"] 
                }}}
                ]).then(data => {
                    res.json({
                        status: "SUCCESS",
                        message: "Listing rating modified successfully",
                        data: data
                    })
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "Error: Updating Listing"
        })
    })
});

module.exports = listingRouter;
