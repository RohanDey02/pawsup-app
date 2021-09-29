const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.fullname || !req.body.dateofbirth || !req.body.phonenumber || !req.body.accounttype || !req.body.pettype) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a User
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullname: req.body.fullname,
        dateofbirth: req.body.dateofbirth,
        phonenumber: req.body.phonenumber,
        accounttype: req.body.accounttype,
        pettype: req.body.pettype
    });

    // Save User in the database
    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};

    User.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single User with a username
exports.findOne = (req, res) => {
    const username = req.params.username;

    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Did not find User with username " + username });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with username=" + username });
        });
};

// Update a User by the username in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const username = req.params.username;

    User.findByIdAndUpdate(username, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with username=${username}. Maybe Tutorial was not found!`
                });
            } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with username=" + username
            });
        });
};

// Delete a User with the specified username in the request
exports.delete = (req, res) => {
    const username = req.params.username;

    User.findByIdAndRemove(username)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with username=${username}.`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with username=" + username
            });
        });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Users were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};

// // Find all published Users
// exports.findAllPublished = (req, res) => {
//     User.find({ published: true })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving users."
//             });
//         });
// };