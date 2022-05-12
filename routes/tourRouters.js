const express = require('express');
const tourController = require('../contoroller/tourController');
const authController = require('./../contoroller/authController');

const router = express.Router();
router
  .route('/')
  .get(tourController.getAllTournaments)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.createTournament
  );

router
  .route('/:id')
  .get(tourController.getTournamentById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.uploadTournamentImgs,
    tourController.resizeTournamentImgs,
    tourController.updateTournament
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTournament
  );

module.exports = router;
