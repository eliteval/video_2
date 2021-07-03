const httpStatus = require('http-status');
const path = require('path');

const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const Template=require('../models/template.model')




/**
 * Load user and append to req.
 * @public
 */
exports.getTemplates = async (req, res, next) => {
    try {
        console.log('sdf');
        const template= await Template.find();
        console.log('template')
        console.log(template)
        res.status(httpStatus.OK).json(template);
    } catch (error) {
        return next(error);
    }
};




