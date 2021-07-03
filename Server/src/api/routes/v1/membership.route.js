const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/membership.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .get(controller.getMembership);

router
  .route('/change')
  .post(controller.changeMembership);

module.exports = router;
