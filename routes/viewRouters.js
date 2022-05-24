const express = require('express');
const viewController = require('./../contoroller/viewController');
const authController = require('./../contoroller/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get(
  '/tournament/:slug',
  authController.isLoggedIn,
  viewController.getTournament
);
router.get(
  '/tournament',
  authController.isLoggedIn,
  viewController.getTournaments
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
// router.get('/logout', authController.isLoggedIn, viewController.getLogoutForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
