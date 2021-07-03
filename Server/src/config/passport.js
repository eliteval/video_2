const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const Admin = require('../api/models/admin.model');
const User = require('../api/models/user.model');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const userData = await User.findById(payload.sub);
    let user = userData ? userData: await Admin.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};


exports.jwt = new JwtStrategy(jwtOptions, jwt);
