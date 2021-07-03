const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
  listUsers,
  updateUser,
} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission SuperAdmin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   * @apiParam  {String}             [email]      User's email
   * @apiParam  {String=user,admin, SuperAdmin}  [role]       User's role
   *
   * ......................................................
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listUsers), controller.list);

router
  .route('/verify/state/:userId')
  .patch(authorize(), /*validate(updateUser),*/ controller.verifyState)

router
  .route('/:userId')
  /**
   * @api {patch} v1/users/:id Update User by admin
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(), /*validate(updateUser),*/ controller.update)
  /**
   * @api {patch} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(ADMIN), controller.remove);


router.route('/super-providers')
  .get(controller.getProviders);

router.route('/getUserById/:userId')
  .get(controller.getUserById);

router.route('/super-providers')
  .post(controller.createUser);

router.route('/filterProvider/:filterValue')
  .get(controller.getFilterProvider);

/**
* api/v1/users/deleteProvider
* */
router.route('/deleteProvider/:providerId')
  .delete(controller.deleteProvider);

router.route('/super-admins')
  .get(controller.getAdmins);

router.route('/super-admins/:adminId')
  .get(controller.getAdminById);

router.route('/super-admins')
  .post(controller.createAdmin);

router.route('/super-admins/:adminId')
  .put(controller.updateAdmin);

router.route('/filterAdmin/:filterValue')
  .get(controller.getFilterAdmin);

router.route('/deleteAdmin/:providerId')
  .delete(controller.deleteAdmin);

/**
api/v1/users/email-verification
*/
router.route('/email-verification')
  .post(authorize(), controller.sendEmail);

/**
 * api/v1/users/sms-verification
 * */
router.route('/sms-verification')
  .post(authorize(), controller.sendSMS);

/**
 * api/v1/users/images
 * */
router.route('/images')
  .post(authorize(), controller.fileUpload);

/**
 * api/v1/users/sigImages
 * */
router.route('/sigImages')
  .post(authorize(), controller.sigImgUpload);

/**
 * api/v1/users/update-profile/:userId
 * */
router.route('/update-profile/:userId')
  .put(authorize(), controller.updateProfile);


/**
* api/v1/users/updateSignature/:userId
* */
router.route('/updateSignature/:userId')
  .put(authorize(), controller.updateSignature);

/**
* api/v1/users/updatePayment/:userId
* */
router.route('/updatePayment/:userId')
  .put(authorize(), controller.updatePayment);

/**
 * api/v1/users/payment/:userId
 * */
router.route('/payment/:userId')
  .get(authorize(), controller.getPayData);


/**
* api/v1/users/signature/:userId
* */
router.route('/signature/:userId')
  .get(authorize(), controller.getSignature);

/**
 * api/v1/users/getBlog/:userId
 * */
router.route('/getBlog/:userId')
  .get(authorize(), controller.getBlog);

/**
* api/v1/users/postBlog
* */
router.route('/postBlog')
  .post(authorize(), controller.postBlog);

/**
* api/v1/users/updateBlog
* */
router.route('/updateBlog')
  .put(authorize(), controller.updateBlog);

/**
* api/v1/users/deleteBlog
* */
router.route('/deleteBlog/:postId')
  .delete(authorize(), controller.deleteBlog);

/**
  * api/v1/users/updatePlanId
  * *//*
router.route('/updatePlanId')
  .put(controller.updatePlanId);*/

/**
  * api/v1/users/changeSubscriptionStatus
  * *//*
router.route('/changeSubscriptionStatus')
  .put(controller.changeSubscriptionStatus);*/


module.exports = router;
