const express = require('express');
const bookingController = require('./../contoroller/bookingController');
const authController = require('./../contoroller/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:tournamentId',
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
