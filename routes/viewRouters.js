const express = require('express');
const viewController = require('./../contoroller/viewController');
const authController = require('./../contoroller/authController');
const bookingController = require('../contoroller/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get(
  '/tournament/:slug',
  authController.isLoggedIn,
  viewController.getTournament
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

module.exports = router;
