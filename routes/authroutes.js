const { Router } = require('express');
const authController = require('../controllers/authController')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//new routes
router.get('/dashboard', authController.dashboard_get);
// router.get('/apointments', authController.dashboard_get);
// router.get('/patients', authController.dashboard_get);
// router.get('/requests', authController.dashboard_get);
module.exports = router;
