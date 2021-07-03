const httpStatus = require('http-status');
const passport = require('passport');
const Patient = require('../models/patient.model');
const APIError = require('../utils/APIError');
const logger = require('../../config/logger');

const PATIENT = 'Patient';
exports.PATIENT = PATIENT;

exports.authorize = (roles = Patient.roles) => (req, res, next) => {
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
      logger.error("logIn nok :", apiError)
      return next(apiError);
    }
    //logger.info("logIn ok :", user["_id"])
    await logIn(user, { session: false });
  } catch (e) {
    logger.error("apiError :" + apiError)
    return next(apiError);
  }

  //logger.info("evaluate roles: " + roles )
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
