const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/upload.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .post(controller.fileUpload);
router
  .route('/youtube/:clipUrl')
  .get(controller.youtube);
router
  .route('/fb')
  .post(controller.fb);
router
  .route('/twitch')
  .post(controller.twitch);

module.exports = router;
