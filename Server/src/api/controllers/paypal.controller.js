const httpStatus = require('http-status');
const path = require('path');

const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const User = require('../models/user.model');
const logger = require('../../config/logger');


const paypal = require('@paypal/checkout-server-sdk');
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
//const environment = process.env.PAYPAL_MODE;
/**
 * Load user and append to req.
 * @public
 */


exports.create = async (req, res) => {
    try {
        let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        let client = new paypal.core.PayPalHttpClient(environment);

        // Construct a request object and set desired parameters
        // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
        let request = new paypal.orders.OrdersCreateRequest();
        //  const user = await User.findById(req.user.id);

        // let token = new PaypalToken({ _userId: req.user.id, level: req.body.level, token: crypto.randomBytes(16).toString('hex') });
       // await token.save();
        request.requestBody({
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": req.body.amount
                    },
                    "reference_id": 'merchant'
                }
            ],
            "application_context": {
                "cancel_url": "https://example.com/cancel",
                "return_url": "https://example.com/return"
            }
        });
        let response = await client.execute(request);
        console.log('response')
        console.log(response)
        // console.log(`Response: ${JSON.stringify(response)}`);
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        // console.log(`Order: ${JSON.stringify(response.result)}`);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.capture = async (req, res) => {
    try {
        let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        let client = new paypal.core.PayPalHttpClient(environment);

        // Construct a request object and set desired parameters
        // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
        let request = new paypal.orders.OrdersCreateRequest();
        request = new paypal.orders.OrdersCaptureRequest(req.body.order.id);
        request.requestBody({});
        // Call API with your client and get a response for your call
        let response = await client.execute(request);
         console.log('response')
         console.log(response)
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        // console.log(`Capture: ${JSON.stringify(response.result)}`);
        // console.log(response);
        // const token = await PaypalToken.findOne({ token: response.result.purchase_units[0].reference_id });

         const user = await User.findById(req.body.order.userId);
         console.log('user')
         console.log(user)
         user.balance+=Number(response.result.purchase_units[0].payments.captures[0].amount.value)
        // user.membership += token.level;
        // user.membershipDate = Date.now();
        // user.balance = 0;
        // await token.remove();
        const updatedUser= await user.save();
        return res.status(200).json({balance:updatedUser.balance});
    } catch (error) {
        console.log(error);
        next(error);
    }

};




