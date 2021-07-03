const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/editor.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .get(controller.makeVideo);

router
  .route('/mute-audio')
  .get(controller.muteVideo);

  router
  .route('/youtube')
  .get(controller.youtube);

  router
  .route('/fb')
  .get(controller.fb);

  router
  .route('/twitch')
  .get(controller.twitch);



  router
  .route('/youtube')
  .get(controller.twitch);

router
  .route('/remove-video')
  .get(controller.removeVideo);

router
  .route('/thumbnail')
  .post(controller.thumbnail);

router
.route('/video-info')
.get(controller.videoInfo);

// router
// .route('/effect-fadein')
// .get(controller.videoInfo);
// router
// .route('/effect-fadeout')
// .get(controller.videoInfo);

// router
// .route('/effect-sharpen')
// .get(controller.videoInfo);


module.exports = router;
