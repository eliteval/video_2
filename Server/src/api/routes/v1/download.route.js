const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/download.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/:fileName')
  .get(controller.download);

module.exports = router;
