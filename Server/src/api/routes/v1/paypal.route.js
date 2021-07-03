const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/paypal.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/create')
  .post(controller.create);

  router
  .route('/capture')
  .post(controller.capture);

module.exports = router;
