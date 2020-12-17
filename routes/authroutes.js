const { Router } = require('express');
const authController = require('../controllers/authController');
const doctorController = require('../controllers/doctorController');
const { requireDocAuth, checkDoctor } = require('../middleware/doctorMiddleware');
const router = Router();

router.get('/signup', doctorController.signup_get);
router.post('/signup', doctorController.signup_post);
router.get('/login', doctorController.login_get);
router.post('/login', doctorController.login_post);
router.get('/logout', doctorController.logout_get);

router.get('/', requireDocAuth, doctorController.dashboard_get);
//new routes
// router.get('/dashboard', authController.dashboard_get);
// router.get('/apointments', authController.dashboard_get);
// router.get('/patients', authController.dashboard_get);
// router.get('/requests', authController.dashboard_get);



//Patient routes
router.get('/patient-login', authController.login_get);
router.get('/patient-signup', authController.signup_get);
router.post('/patient-login', authController.login_post);
router.post('/patient-signup', authController.signup_post);
router.get('/patient-logout', authController.logout_get);

router.get('/home', requireDocAuth, authController.patient_index);
router.get('/view-doctor/:id', requireDocAuth, authController.doctor_details);
router.get('/view-all-doctors', requireDocAuth, authController.view_all_doctors);
router.get('/patient-activity', requireDocAuth, authController.paient_activity);
router.get('/patient-account', requireDocAuth, authController.patient_account);
router.post('/book-appointment', requireDocAuth, authController.book_appointment_post);

module.exports = router;
