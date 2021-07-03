const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');
const logger = require('./../../config/logger');

const SUPER_ADMIN = 'SuperAdmin';
const ADMIN = 'Admin';
const PROVIDER = 'Provider';

exports.ADMIN = ADMIN;
exports.SUPER_ADMIN = SUPER_ADMIN;
exports.PROVIDER = User.roles;

exports.authorize = (roles = User.roles) => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles), )(req, res, next)
};

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;

  const logIn = Promise.promisify(req.logIn);

  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) {
      logger.error("logIn nok :" + apiError)
      return next(apiError);
    }
    logger.warn("logIn ok :" + user["_id"])
    await logIn(user, { session: false });
  } catch (e) {
    logger.error("apiError :" + apiError)
    return next(apiError);
  }

  //logger.warn("evaluate roles: " + roles )
  if (!roles.includes(user.role)) {
    logger.error("roles: " + roles +" user.role :" + user.role)
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};
