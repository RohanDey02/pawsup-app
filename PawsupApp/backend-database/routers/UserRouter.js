/*
  This is where we implement the queries. Some queries include signup POST and signin POST.
*/

const express = require('express');
const userRouter = express.Router();

// MongoDB Models
const User = require('../models/User');

// Password Encrypter
const bcrypt = require('bcrypt');

// USER:

// Signup
userRouter.post('/signup', (req, res) => {
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
userRouter.post('/signin', (req, res) => {
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
userRouter.get('/getUser', (req, res) => {
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
userRouter.put('/update', (req, res) => {
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

// Remove User
userRouter.delete('/deleteUser', (req, res) => {
    let email = req.query.email;

    email = email.trim();

    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Credentials"
        })
    } else {
        var conditions = { email: email };

        // Removes User, if it exists, by its email
        User.find(conditions).then(data => {
            User.deleteOne(conditions, req.body).then(doc => {
                if (doc.deletedCount < 1) {
                    res.json({
                        status: "FAILED",
                        message: "No User Was Deleted"
                    })
                } else {
                    res.json({
                        status: "SUCCESS",
                        message: "User Deleted Successfully",
                        data: data
                    })
                }
            });
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error: Finding User, Perhaps Doesn't Exist"
            })
        })
    }
});

// Get Previous Ordered Items
userRouter.get('/getPreviousOrders', (req, res) => {
    let email = req.query.email;

    if (email == "") {
        res.json({
            status: "FAILED",
            message: "Error: Empty Email Field!"
        })
    } else {
        var query = { email: email };

        // Project only previousorders field
        User.find(query, { previousorders: 1 }).then(data => {
            res.json({
                status: "SUCCESS",
                message: "User Found Successfully",
                data: data[0]
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

module.exports = userRouter;
