/*
  This is where we implement the queries. Some queries include signup POST and signin POST.
*/

const express = require('express');
const paymentsRouter = express.Router();

// Stripe Implementation
const Stripe = require("stripe");
const PUBLISHABLE_KEY = "pk_test_51JuLH0JReyjnby8oC8maNyfaVdFojSjYkPSXKnYjkC6FpeSYq8F28oAW6X4FzafORx4kUustkwvdB6kegnLh1RLL00AKUD17mC";
const SECRET_KEY = "";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

// Stripe Payments
paymentsRouter.post("/createPaymentIntent", async (req, res) => {
    let amount = req.query.amount;

    if (amount < 0) {
        res.json({ error: "Incorrect Amount" });
    } else {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // In cents
                currency: "cad",
                payment_method_types: ["card"],
            });

            const clientSecret = paymentIntent.client_secret;

            res.json({
                status: "SUCCESS",
                message: "Payment Successful!",
                data: clientSecret,
            });
        } catch (e) {
            console.log(e.message);
            res.json({
                status: "FAILED",
                message: e.message,
                data: {}
            });
        }
    }
});

module.exports = paymentsRouter;
