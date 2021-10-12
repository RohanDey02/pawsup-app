/*
  This is where we implement the queries. Some queries include signup POST and signin POST. 
*/

const express = require('express');
const router = express.Router();

// MongoDB Model
const User = require('./../models/User');

// Password Encrypter
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
    let { email, password, fullname, dateofbirth, phonenumber, accounttype, pettype } = req.body;

    email = email.trim();
    password = password.trim();
    fullname = fullname.trim();
    dateofbirth = dateofbirth.trim();
    phonenumber = phonenumber.trim();
    accounttype = accounttype.trim();
    pettype = pettype.trim();

    if (email == "" || password == "" || fullname == "" || dateofbirth == "" || phonenumber == "" || accounttype == "" || pettype == "") {
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
    } else if (!/^[\d]{10}$/.test(phonenumber)) {
        res.json({
            status: "FAILED",
            message: "Invalid phone number entered",
        });
    } else if (!/^[a-zA-Z ]*$/.test(accounttype)) {
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

                // Password Handler
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        email,
                        password,
                        fullname,
                        dateofbirth,
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
                // res.json({
                //     status: "SUCCESS",
                //     message: "Update Successful"
                // })
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

module.exports = router;