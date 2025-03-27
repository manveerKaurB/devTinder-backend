const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const {firstName, lastName, emailId} = req.user;
        const order = await razorPayInstance.orders.create({
            "amount": memebershipAmount.membershipType * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
              "firstName": firstName,
              "lastName": lastName,
              "emailId": emailId,
              "membershipType": membershipType
            }
        })
        consolr.log(order);
        // save order to database
    
        const payment = new Payment({
            userId: res.used._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        })

        const savedPayment = await payment.save();
        //return back my order details to frontend
        res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});

    }
    catch (err) {
        return res.status(500).json({
            message: "Error creating order",
        })
    }

});

// for webhook we dont need userAuth, as this api is called by razorPay
paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
    // webhook_body should be raw webhook request body
    // validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret)
    const webhookSignature = req.headers("x-razorpay-signature"); // or req.get("x-razorpay-signature") it's same
    // this validates if webhook is correct or not, if you send some malicious information, this validation will fail
    const isWebHookValid = validateWebhookSignature(JSON.stringify(res.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
    
        if(!isWebHookValid) {
            res.status(400).json({message:'Webhook signature is invalid'});
        }

        // update my payment status in DB 
        const paymentDetailsFromWebhook = req.body.payload.payment.entity;
        const payment = await Payment.findOne({
            orderId: paymentDetailsFromWebhook.order_id
        })
        payment.status = paymentDetailsFromWebhook.status;
        await payment.save();

        // update the user as premium
        const user = await User.findOne({
            _id: payment.userId
        })
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // return success response to razorpay

        // if(res.body.event === "payment.captured") {

        // }
        // if(req.body.event="payment.failed") {

        // }
        return res.status(200).json({message: "webhook received successfully"})
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user.toJSON();
    if(user.isPremium) {
        return res.json({...user})
    }
    return res.json({...user})
})

module.exports = paymentRouter;