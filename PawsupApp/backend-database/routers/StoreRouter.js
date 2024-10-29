/*
  This is where we implement the queries. Some queries include signup POST and signin POST.
*/

const express = require('express');
const storeRouter = express.Router();

// MongoDB Models
const Item = require('../models/Item');

// STORE:

// Make item
storeRouter.post('/makeItem', (req, res) => {
    // inCart is not taken into account here because item is being created,
    // so no users can have it in their cart.
    let { name, price, description, image, pets, quantity } = req.body;

    name = name.trim();
    description = description.trim();
    image = image.trim();
    for (var pet in pets) {
        pet = pet.trim();
    }

    if (name == "" || price == "" || description == "" || image == "" || quantity == "" || pets.length == 0 || pets.includes(null)) {
        res.json({
            status: "FAILED",
            message: "Empty fields!"
        });
    } else if ((!/^\d+(\.\d{1,2}){0,1}$/.test(price)) || (!/^\d+(\.\d{1,2}){0,1}$/.test(quantity))) {
        res.json({
            status: "FAILED",
            message: "Price or Quantity is not a number",
        });
    } else if (price < 1 || quantity < 0){
        res.json({
            status: "FAILED",
            message: "Price or Quantity is not a valid amount",
        });
    // TODO: make tests for pets
    } else {
        // Check if item exists
        Item.find({ name }).then(result => {
            if (result.length) {
                // Item exists
                res.json({
                    status: "FAILED",
                    message: "Item already exists"
                })
            } else {
                // Create item

                const newItem = new Item({
                    name,
                    price,
                    description,
                    image,
                    pets,
                    quantity,
                    inCart: []
                })

                newItem.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Item Creation Successful",
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
                message: "Error: Checking for existing item"
            })
        })
    }
});

// Modify item
storeRouter.put('/modifyItem', (req, res) => {
    let { name, price, description, image, pets, quantity } = req.body;

    name = name.trim();
    description = description.trim();
    image = image.trim();
    for (var pet in pets) {
        pet = pet.trim();
    }

    if (name == "" || price == "" || description == "" || image == "" || quantity == "" || pets.length == 0 || pets.includes(null)) {
        res.json({
            status: "FAILED",
            message: "Empty fields!"
        });
    } else if ((!/^\d+$/.test(price)) || (!/^\d+$/.test(quantity))) {
        res.json({
            status: "FAILED",
            message: "Price or Quantity is not a number",
        });
    } else if (price < 1 || quantity < 0){
        res.json({
            status: "FAILED",
            message: "Price or Quantity is not a valid amount",
        });
    } else {
        // Find item in database
        var query = { name };

        Item.updateOne(query, req.body).then(doc => {
            if (!doc) {
                res.json({
                    status: "FAILED",
                    message: "Error: Could Not Find item"
                })
            } else {
                Item.find(query).then(data =>
                    res.json({
                        status: "SUCCESS",
                        message: "Item Modification Successful",
                        data: data
                    })
                )
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing Item"
            })
        })
    }
});

// Get item
storeRouter.get('/getItem', (req, res) => {
    let name = req.query.name;

    if (name == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Name Field!"
        })
    } else {
        var query = { name: name };

        Item.find(query).then(data => {
            if (data.length == 0) {
                res.json({
                    status: "FAILED",
                    message: "Error: Could Not Find item"
                })
            } else {
                res.json({
                    status: "SUCCESS",
                    message: "Item found",
                    data: data
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding item in database"
            })
        })
    }
});

// Delete item from database
storeRouter.delete('/deleteItem', (req, res) => {
    let name = req.query.name;

    name = name.trim();
    if (name == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        var query = { name: name };
        Item.deleteOne(query).then(doc => {
            if (doc.deletedCount < 1) {
                res.json({
                    status: "FAILED",
                    message: "Error: No item deleted"
                })
            } else {
                res.json({
                    status: "SUCCESS",
                    message: "Item deleted successfully",
                    data: doc
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Deleting Items"
            })
        })
    }
});

// Add item to cart for User
storeRouter.put('/addToCart', (req, res) => {
    let { item, email, quantity } = req.body;

    item = item.trim();
    email = email.trim();

    if (item == "" || email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Fields!"
        })
    } else if (!/^\d+$/.test(quantity)) {
        res.json({
            status: "FAILED",
            message: "Error: Quantity is not a number!"
        })
    } else {
        var query = { name: item };
        var quant = parseInt(quantity);

        Item.find(query).then(data => {
            if (data.length == 0) {
                res.json({
                    status: "FAILED",
                    message: "Error: Could Not Find item"
                })
            } else {
                if (data[0].quantity >= quant) {
                    // Check if user already has item in cart
                    filtered = data[0].inCart.filter(function(value) {
                        return (value.user == email);
                    })
                    var cartAdd;
                    // User has item in cart
                    if (filtered.length == 1) {
                        filtered[0].quantity += quant;
                        cartAdd = filtered[0];
                    } else {
                        cartAdd = { user: email, quantity: quant };
                    }

                    // Returns cart data for item without the user whose quantity is being changed
                    filtered = data[0].inCart.filter(function(value) {
                        return (value.user != email);
                    })
                    filtered.push(cartAdd);
                    data[0].inCart = filtered;
                    // Remove quantity added to cart from total stock for item shown
                    data[0].quantity -= quant;

                    Item.updateOne(query, data[0]).then(doc => {
                        if (!doc) {
                            res.json({
                                status: "FAILED",
                                message: "Error could not update item"
                            })
                        } else {
                            Item.find(query).then(data =>
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
                            message: "Error: Checking for Existing Item #1"
                        })
                    })
                } else {
                    console.log(item.quantity, quantity);
                    res.json({
                        status: "FAILED",
                        message: "Error: Quantity to be added greater than quantity of item"
                    })
                }
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing User #2"
            })
        })
    }
});

// Remove item from cart for User
storeRouter.put('/removeFromCart', (req, res) => {
    let { item, email, quantity } = req.body;

    item = item.trim();
    email = email.trim();

    if (item == "" || email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Fields!"
        })
    } else if (!/^\d+$/.test(quantity)) {
        res.json({
            status: "FAILED",
            message: "Error: Quantity is not a number!"
        })
    } else {
        var query = { name: item };
        var quant = parseInt(quantity);

        Item.find(query).then(data => {
            if (data.length == 0) {
                res.json({
                    status: "FAILED",
                    message: "Error: Could Not Find item"
                })
            } else {
                filtered = data[0].inCart.filter(function(value) {
                    return (value.user == email);
                })
                var cartRemove;
                // User has item in cart
                if (filtered.length == 1) {
                    var newQuantity = filtered[0].quantity - quant;
                    // Initialises cartRemove if newQuantity is positive value,
                    // otherwise user is removed from cart array for item
                    if (newQuantity > 0) {
                        cartRemove = { user: email, quantity: newQuantity };
                        // Adds back quantity taken away from user to total stock for item
                        data[0].quantity += quant;
                    } else {
                        // Adds back all the quantity that was in user's order, since order
                        // since order is to be removed entirely from cart
                        data[0].quantity += filtered[0].quantity;
                    }
                    filtered = data[0].inCart.filter(function(value) {
                        return (value.user != email);
                    })
                    // If cartRemove has an actual object then add the object to filtered,
                    // otherwise this means quantity was invalid so do not re-add
                    if (cartRemove != null) {
                        filtered.push(cartRemove);
                    }
                    data[0].inCart = filtered;

                    Item.updateOne(query, data[0]).then(doc => {
                        if (!doc) {
                            res.json({
                                status: "FAILED",
                                message: "Error could not update item"
                            })
                        } else {
                            Item.find(query).then(data =>
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
                            message: "Error: Checking for Existing Item #1"
                        })
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Error: User does not have item in cart"
                    })
                }
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Checking for Existing User #2"
            })
        })
    }
});

storeRouter.get('/getInCart', (req, res) => {
    let email = req.query.email;

    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Listing User Email Field!"
        })
    } else {
        var cart = [];
        var totalPrice = 0;
        Item.find().then(data => {
            for (var item of data) {
                for (var cartElem of item.inCart) {
                    if (cartElem.user == email) {
                        // Changes item's quantity to be the quantity that user has in cart
                        item.quantity = cartElem.quantity;
                        cart.push(item);
                        totalPrice += (cartElem.quantity * item.price);
                    }
                }
            }
            res.json({
                status: "SUCCESS",
                message: "Items in cart found",
                data: cart,
                totalPrice
            })
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding Items"
            })
        })
    }
});

// Get all items
storeRouter.get('/getAllItems', (req, res) => {
    Item.find().then(data => {
        if (data.length == 0) {
            res.json({
                status: "FAILED",
                message: "Error: No Items found in database"
            })
        } else {
            res.json({
                status: "SUCCESS",
                message: "Items found in database",
                data: data
            })
        }
    })
})

// Filter Store Listings By Price
storeRouter.get('/filterPriceItemListings', (req, res) => {
    let minprice = parseInt(req.query.minprice);
    let maxprice = parseInt(req.query.maxprice);
    var itemlistingnames = [];

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
        Item.find({} , (err, itemListings) => {
            if(err){
                res.json({
                    status: "FAILED",
                    message: "Error: Finding Listings"
                })
            } else{
                itemListings.map(itemListing => {
                    // Check the listing price to see if it works
                    if(itemListing.price >= minprice && itemListing.price <= maxprice){
                        itemlistingnames.push(itemListing.name);
                    }
                })

                res.json({
                    status: "SUCCESS",
                    message: "Store Listings With Suitable Price Found Successfully",
                    data: itemlistingnames
                })
            }
        })
    }
});

// Filter Store Listings By Pet Type
storeRouter.get('/filterPettypeItemListings', (req, res) => {
    let pettype = req.query.pettype;
    pettype = pettype.toLowerCase();
    var lowercased;
    var itemlistingnames = [];

    if(pettype == ""){
        res.json({
            status: "FAILED",
            message: "Error: Entering Empty Pet Type!"
        })
    } else if (pettype == "any" ) {
        Item.find({} , (err, itemListings) => {
            if(err){
                res.json({
                    status: "FAILED",
                    message: "Error: Finding Listings"
                })
            } else{
                itemListings.map(itemListing => {
                    itemlistingnames.push(itemListing.name);
                })

                res.json({
                    status: "SUCCESS",
                    message: "Store Listings With Suitable Pet Types Found Successfully",
                    data: itemlistingnames
                })
            }
        })
    } else {
        Item.find({} , (err, itemListings) => {
            if(err){
                res.json({
                    status: "FAILED",
                    message: "Error: Finding Listings"
                })
            } else{
                itemListings.map(itemListing => {
                    // Check the store listing pet types to see if it works
                    lowercased = itemListing.pets.map(pet => pet.toLowerCase());

                    if(lowercased.includes(pettype)){
                        itemlistingnames.push(itemListing.name);
                    }
                })

                res.json({
                    status: "SUCCESS",
                    message: "Store Listings With Suitable Pet Types Found Successfully",
                    data: itemlistingnames
                })
            }
        })
    }
});

module.exports = storeRouter;
