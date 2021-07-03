const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/template.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .get(controller.getTemplates);

module.exports = router;
