const httpStatus = require('http-status');
const path = require('path');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');
const Post = require('../models/post.model');
const Payment = require('../models/payment.model');
const nodemailer = require("nodemailer");
const { emailConfig, smsConfig } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl, baseWebUrl } = require('../../config/vars');
const Bucket = require("../services/awsbucket/bucket");
const validateCMP = require("../services/cmp/cmp");
const logger = require('../../config/logger')
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const userData = await User.findById(id);
    const user = userData ? await User.findById(id) : await Admin.findById(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Update existing user
 * @api {patch} v1/users/:userId
 * @public
 */
exports.update = async (req, res, next) => {
  console.log("update patch");
  const user = await User.findOne({ _id: req.body.userId });
  const userModel = user ? User : Admin;
  userModel.findOneAndUpdate({ _id: req.body.userId }, req.body, { new: true })
    .then(savedUser => res.json(savedUser))
    .catch(e => next(userModel.checkDuplicateField(e)));
};

exports.verifyState = async (req, res, next) => {
  let userData = req.body;
  const user = await User.findOne({ _id: req.body.userId });
  const userModel = user ? User : Admin;

  /*console.log("userDate.permission");
  console.log(userDate.permission);
  console.log("user.cmp");
  console.log(user.cmp);*/

  if (userData.permission.includes("approved") > 0 && (user.cmp != null || user.cmp != "")) {
    validateCMP.validateCMPActive(user.cmp, (active, photo) => {

      if (active) {
        userData.image = photo;
        userData.createdAt = new Date();
        userData.freeUse = true
        /*console.log("userDate");
        console.log(userDate);*/
        userModel.findOneAndUpdate({ _id: req.body.userId }, userData, { new: true })
          .then(savedUser => res.json(savedUser))
          .catch(e => next(userModel.checkDuplicateField(e)));
      } else {
        res.status(httpStatus.CONFLICT).send({ error: "Inactive user CMP" });
      }

    });
  } else {
    userModel.findOneAndUpdate({ _id: req.body.userId }, req.body, { new: true })
      .then(savedUser => res.json(savedUser))
      .catch(e => next(userModel.checkDuplicateField(e)));
  }

};


/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {

    const userData = await User.list(req.query);
    const adminData = await Admin.list(req.query);
    const users = adminData.concat(userData);
    const transformedUsers = users.map(user => {
      if (user.role === "SuperAdmin") {
        console.log("super admin", user)
      } else {
        return user.transform()
      }
    });
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    res.status(httpStatus.OK).json(user)
  })
    .catch(e => next(e));
}

exports.createUser = async (req, res, next) => {
  try {
    new User(req.body).save().then(result => {
      res.status(httpStatus.OK).json(result);

    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;
  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};


exports.getProviders = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(httpStatus.OK).json(user)
    })
    .catch(e => next(e));
};



exports.getFilterProvider = (req, res, next) => {
  const fullName = req.params.filterValue;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];

  User.find({ firstName, lastName })
    .then((user) => {
      res.status(httpStatus.OK).json(user)
    })
    .catch(e => next(e));
};

/**
 * Delete provider of users collection
 * */

exports.deleteProvider = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    const user = await User.findByIdAndDelete(providerId);
    res.status(httpStatus.OK).send();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

}

exports.getAdmins = (req, res, next) => {
  Admin.find()
    .then((admin) => {
      res.status(httpStatus.OK).json(admin)
    })
    .catch(e => next(e));
};

exports.getAdminById = (req, res, next) => {
  Admin.findById(req.params.adminId)
    .then((admin) => {
      res.status(httpStatus.OK).json(admin)
    })
    .catch(e => next(e));
};

exports.createAdmin = async (req, res, next) => {
  try {
    console.log('req.body')
    console.log(req.body)
    new Admin(req.body).save().then(result => {
      console.log('result')
      console.log(result)
      res.status(httpStatus.OK).json(result);

    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    console.log('req.body')
    console.log(req.body)
    console.log('req.params.adminId')
    console.log(req.params.adminId)
    await Admin.findByIdAndUpdate(req.params.adminId, req.body);
    res.status(httpStatus.OK).json('ok');
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.getFilterAdmin = (req, res, next) => {
  const fullName = req.params.filterValue;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];

  Admin.find({ firstName, lastName })
    .then((admin) => {
      res.status(httpStatus.OK).json(admin)
    })
    .catch(e => next(e));
};

/**
 * Delete provider of users collection
 * */

exports.deleteAdmin = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    const admin = await Admin.findByIdAndDelete(providerId);
    res.status(httpStatus.OK).send();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

}

/**
 Send email when change user's status to approved or deny to user's email
 */

exports.sendEmail = (req, res) => {
  console.log("request came");
  let user = req.body;
  const buffer = new Buffer(user.email);
  const fakeToken = buffer.toString('base64');
  const verifyUrl = baseWebUrl + `auth/verify-email/${fakeToken}`;

  console.log("verifyUrl:" + verifyUrl)

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false,
    auth: {
      user: emailConfig.username,
      pass: emailConfig.password
    }
  });

  let mailOptions = {};
  if (user.permission.includes("approved")) {
    mailOptions = {
      from: emailConfig.username,
      to: user.email,
      subject: "Your MEVICO accounts is" + " " + user.permission,
      html: "<br/>" + "<br/>" + "<div>Please click <a href='" + verifyUrl + "'>here</a> to make your account active</div>"
    };
  } else if (user.permission.includes("deny")) {
    mailOptions = {
      from: emailConfig.username,
      to: user.email,
      subject: "Your MEVICO accounts is" + " " + user.permission,
      html: "<br/>" + "<br/>" + "<div>Your request was denied. Please contact support.</div>"
    };
  } else {
    return;
  }


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("sendMail:", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    } else {
      res.status(200).send(user);
      console.log('Email sent: ' + info.response);
    }
  });
};


/**
 * Send SMS when user's permission change from pending, deny, approved to user's phone number
 * */

exports.sendSMS = (req, res) => {
  const userData = req.body;

  console.log("userData");
  console.log(userData);

  const buffer = new Buffer(userData.email);
  const fakeToken = buffer.toString('base64');
  const code = Math.floor(100000 + Math.random() * 900000)
  const textApproved = "Please visit following url like and enter verification code -";
  const textDeny = "Your request was denied. Please contact support.";
  const verifyUrl = baseUrl + 'auth/verify-sms/' + fakeToken;
  let smsContent = '';
  if (userData.permission.includes("approved")) {
    smsContent = textApproved + " " + code + " " + "See:  " + verifyUrl;
  } else if (userData.permission.includes("deny")) {
    smsContent = textDeny + " " + code + " " + "See:  " + verifyUrl;
  } else {
    return;
  }

  client.messages.create({ from: smsConfig.sender, body: smsContent, to: userData.phoneNumber })
    .then(result => {
      if (!result.errorCode) {
        User.findOneAndUpdate({ email: userData.email }, { smsCode: code })
          .then(result1 => {
            res.status(200).send(result1)
          })
      }
    }).catch(e => {
      console.log("SMS failed to sent", e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    })
};


/**
 * Upload files when user update his profile.
 * */

exports.fileUpload = async (req, res) => {
  var rand_no = Math.floor(123123123123 * Math.random());
  if (req.body.key) {
    const file = req.files.file;
    const fileName = rand_no + file.name;
    await Bucket.uploadFile("qrcodes", fileName, file.data, {
      ContentType: file.mimetype
    }, async (err, data) => {
      if (err) {
        logger.error("Bucket Error creating the file: ", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
      } else {
        logger.info("Bucket Successfully created a file on S3 : " + data.Location);
        res.status(httpStatus.CREATED).json({ location: data.Location });
      }
    });
  } else {
    const user = await User.findOne({ _id: req.body._id });
    const oldFileName = user.image.substring(user.image.lastIndexOf("/") + 1, user.image.length);
    Bucket.deleteFile("avatar", oldFileName, async (err, data) => {
      if (err) {
        logger.error("Bucket Error deleting file: " + oldFileName, err);
      } else {
        logger.info("Bucket deleting file: " + oldFileName);
      }
    });
    const userModel = user ? User : Admin;
    const file = req.files.file;
    const fileName = rand_no + file.name;
    await Bucket.uploadFile("avatar", fileName, file.data, {
      ContentType: file.mimetype
    }, async (err, data) => {
      if (err) {
        logger.error("Bucket Error creating the file: ", err);
      } else {
        logger.info("Bucket Successfully created a file on S3 : " + data.Location);
        userModel.findOneAndUpdate({ _id: req.body._id }, { image: data.Location }, { new: true }).then(result => {
          res.status(httpStatus.CREATED).json(result);
        }).catch(e => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        })
      }
    });
  }
};

/**
 * Upload signature image.
 * */

exports.sigImgUpload = async (req, res) => {
  var rand_no = Math.floor(123123123123 * Math.random());
  const file = req.files.file;
  const fileName = rand_no + file.name;

  /*const imagePath = path.join(__dirname + './../../public/images/');
  console.log(imagePath + fileName);
*/

  await Bucket.uploadFile("signature", fileName, file.data, {
    ContentType: file.mimetype
  }, async (err, data) => {
    if (err) {
      logger.error("Bucket Error creating the file: ", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    } else {
      logger.info("Bucket Successfully created a file on S3 : " + data.Location);
      res.status(httpStatus.CREATED).json({ location: data.Location });
    }
  });
  /*
    file.mv(imagePath + fileName, function (error) {
      if (error) {
        console.log("signature image upload error", error)
      } else {
        console.log(imagePath);
        res.status(httpStatus.CREATED).json({ fileName: fileName });
      }
    });*/


};

/**
 * Update profile in user profile page
 * */

exports.updateProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  const userModel = user ? User : Admin;
  const userOldData = req.locals.user;
  let userNewData = req.body.profile;
  if (userNewData.password !== undefined) {
    let password = userNewData.password === '' ? userOldData.password : userNewData.password;
    if (userNewData.password !== '') {
      const rounds = env === 'test' ? 1 : 10;
      const hash = await bcrypt.hash(password, rounds);
      userNewData.password = hash;
    } else {
      userNewData.password = password;
    }
  }

  userModel.findOneAndUpdate({ _id: req.params.userId }, userNewData, { new: true }).then(result => {
    res.status(httpStatus.OK).json(result);
  }).catch(e => {
    return res.send(e)
  })
};

/**
 * Update signature and payment method in user profile page
 * */

exports.updateSignature = async (req, res, next) => {
  try {
    var rand_no = Math.floor(123123123123 * Math.random());
    var signatureImgName = rand_no + "signature.png";
    var sigImgSrc = req.body.signature;
    if (sigImgSrc) {
      if (sigImgSrc.indexOf(';base64,') !== -1) {
        const user = await User.findById(req.params.userId);
        const oldFileName = user.sigImgSrc.substring(user.sigImgSrc.lastIndexOf("/") + 1, user.sigImgSrc.length);
        //Deleting old file
        Bucket.deleteFile("signature", oldFileName, async (err, data) => {
          if (err) {
            logger.error("Bucket Error deleting file: " + oldFileName, err);
          } else {
            logger.info("Bucket deleting file: " + oldFileName);
          }
        });
        //Get base64 data 
        const base64Data = new Buffer.from(sigImgSrc.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        // Get content type
        const type = sigImgSrc.split(';')[0].split('/')[1];
        // Upload data to bucket
        await Bucket.uploadFile("signature", signatureImgName, base64Data, {
          ContentEncoding: 'base64',
          ContentType: `image/${type}`
        }, async (err, data) => {
          if (err) {
            logger.error("Bucket Error creating the file: ", err);
          } else {
            logger.info("Bucket Successfully created a file on S3 : " + data.Location);
            const result = await User.findByIdAndUpdate(
              req.params.userId, { sigImgSrc: data.Location },
              { upsert: true, setDefaultsOnInsert: true });
            res.status(httpStatus.OK).json(result);
          }
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send();
      }
    } else {
      res.status(httpStatus.CONFLICT).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const payMethod = req.body.payment;
    Payment.findByIdAndUpdate(
      req.params.userId,
      { '$set': { QRimg: payMethod.QRimg, account: payMethod.account, url: payMethod.url } },
      { upsert: true, setDefaultsOnInsert: true, new: true })
      .then(result => {
        res.status(httpStatus.OK).json(result);
      })
  } catch (error) {
    next(error);
  }
}

/**
 * Get payment method field from users collection
 * */

exports.getPayData = async (req, res) => {
  const providerId = req.params.userId;
  Payment.findById(providerId).then(result => {
    res.status(httpStatus.OK).json(result);
  }).catch(e => {
    return res.send(e)
  })
};

/**
 * Get signature image namefrom users collection
 * */

exports.getSignature = async (req, res) => {
  const id = req.params.userId;
  User.findById(id).then(result => {
    res.status(httpStatus.OK).json(result.sigImgSrc);
  }).catch(e => {
    return res.send(e)
  })
};


/**
 * Get blog field from users collection
 * */

exports.getBlog = async (req, res) => {
  const id = req.params.userId;
  Post.find({ providerId: id }).sort({ createdAt: -1 }).then(result => {
    res.status(httpStatus.OK).json(result);
  }).catch(e => {
    return res.send(e)
  })
};

/**
 * Insert data to blog field of users collection
 * */

exports.postBlog = async (req, res) => {

  const providerId = req.body.userId;
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  await Bucket.uploadFile("blog", providerId + "-" + postTitle + ".html", postBody, {}, async (err, data) => {
    if (err) {
      logger.info("Bucket Error creating the file: ", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    } else {
      logger.info("Bucket Successfully created a file on S3 : " + data.Location);
      console.log('data')
      console.log(data)
      // a document instance
      const post = new Post({
        providerId: providerId,
        postTitle: postTitle,
        url: data.Location,
      });
      // save model to database
      try {
        const result = await post.save();
        res.status(httpStatus.OK).json(result);
      } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
      }
    }
  });
};

/**
 * Update blog field of users collection
 * */

exports.updateBlog = async (req, res, next) => {
  const postId = req.body.postId;
  const postTitle = req.body.postTitle;

  await Bucket.deleteFile("blog", postId + "-" + postTitle + ".html", async (err, data) => {
    if (err) {
      logger.info("Bucket Error deleting file: " + postId + "-" + postTitle + ".html", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    } else {
      logger.info("Bucket deleting file: " + postId + "-" + postTitle + ".html");
      const postBody = req.body.postBody;
      await Bucket.uploadFile("blog", postId + "-" + postTitle + ".html", postBody, {}, async (err, data) => {
        if (err) {
          logger.error("Bucket Error creating the file: ", err);
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        } else {
          logger.info("Bucket Successfully created a file on S3 : " + data.Location);
          // save model to database
          try {
            const postUpdate = await Post.findByIdAndUpdate(
              postId,
              {
                "$set": {
                  postTitle: postTitle,
                  url: data.Location,
                }
              },
              { new: true }
            );
            res.status(httpStatus.OK).json(postUpdate);
          } catch (error) {
            logger.error("Error ", error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
          }
        }
      });
    }
  });
};

/**
 * Delete blog field of users collection
 * */

exports.deleteBlog = async (req, res, next) => {
  const postId = req.params.postId;
  const postDelete = await Post.findById(postId);
  Bucket.deleteFile("blog", postId + "-" + postDelete.postTitle + ".html", async (err, data) => {
    if (err) {
      logger.info("Bucket Error deleting file: " + postId + "-" + postDelete.postTitle + ".html", err);
    } else {
      logger.info("Bucket deleting file: " + postId + "-" + postDelete.postTitle + ".html");
    }
  });

  try {
    const postDelete = await Post.findByIdAndDelete(postId);
    res.status(httpStatus.OK).json(postDelete);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

};

/*exports.updatePlanId = async (req, res, next) => {
  try {
    console.log('req.body')
    console.log(req.body)
    const user = await User.findByIdAndUpdate(req.body.providerId, { planId: req.body.planId }, { new: true });
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

};*/
/*
exports.changeSubscriptionStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.providerId, { subcriptionStatus: false }, { new: true });
    res.status(httpStatus.OK).json(user.transform());
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

};*/





