const express = require('express');
// const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const editorRoutes = require('./editor.route');
const templateRoutes = require('./template.route');
const uploadRoutes = require('./upload.route');
const paypalRoutes = require('./paypal.route');
const membershipRoutes = require('./membership.route');
const googleDriveRoutes = require('./googleDrive.route');
const downloadRoutes = require('./download.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * @request method api/v1/users, auth, public, provider,
 */

// router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.use('/editor', editorRoutes);
router.use('/template', templateRoutes);
router.use('/upload', uploadRoutes);
router.use('/paypal', paypalRoutes);
router.use('/membership', membershipRoutes);
router.use('/googleDrive', googleDriveRoutes);
router.use('/download', downloadRoutes);

module.exports = router;
