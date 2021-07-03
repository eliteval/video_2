const mongoose = require('mongoose');
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');
const Admin = require("../api/models/admin.model")
// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      useCreateIndex: true,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(async () => {
      console.log('mongoDB connected...');
      const admin = new Admin({
        email: "topwolf0808@gmail.com",
        phoneNumber: "+8613124260482",
        password: "zaq1!QAZ",
        role: "SuperAdmin",
        status: "active"

      });
      const adminData = await Admin.findOne({email: "topwolf0808@gmail.com"});
      if(!adminData) admin.save();

      
      const adminD = new Admin({
        email: "danieldelgado20g@gmail.com",
        phoneNumber: "+51955037779",
        password: "qwaszx123",
        role: "SuperAdmin",
        status: "active"

      });
      const adminDData = await Admin.findOne({email: "danieldelgado20g@gmail.com"});
      if(!adminDData) adminD.save();


      const adminDD = new Admin({
        email: "adminadmin@gmail.com",
        phoneNumber: "+51955037770",
        password: "qwaszx123",
        role: "Admin",
        status: "active"

      });
      const adminDDData = await Admin.findOne({email: "adminadmin@gmail.com"});
      if(!adminDDData) adminDD.save();

    });
  return mongoose.connection;
};
