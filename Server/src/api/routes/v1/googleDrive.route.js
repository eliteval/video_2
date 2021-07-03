const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/googleDrive.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .get(controller.index);

  router
  .route('/callback')
  .get(controller.callback);

  router
  .route('/upload')
  .get(controller.upload);

module.exports = router;
