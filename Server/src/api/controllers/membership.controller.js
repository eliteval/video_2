const httpStatus = require('http-status');
const path = require('path');
const { env, baseUrl } = require('../../config/vars');
const APIError = require('../utils/APIError');

const Membership = require('../models/membership.model');
const User = require('../models/user.model');



/**
 * Load user and append to req.
 * @public
 */
exports.getMembership = async (req, res, next) => {
    try {
        const membership = await Membership.find();
        console.log('membership')
        console.log(membership)
        res.status(httpStatus.OK).json(membership);
    } catch (error) {
        return next(error);
    }
};

exports.changeMembership = async (req, res, next) => {
    try {
        console.log('req.body')
        console.log(req.body)
        const user = await User.findById(req.body.userId);
        if (user.balance < req.body.price) {
            res.status(httpStatus.BAD_REQUEST).send();
        } else {
            user.balance -= req.body.price;
            user.membership = req.body.name;
            const updatedUser = await user.save();
            res.status(httpStatus.OK).json({
                membership: updatedUser.membership,
                balance: updatedUser.balance
            });
        }

    } catch (error) {
        return next(error);
    }
};

