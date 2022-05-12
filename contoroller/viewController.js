// const User = require('./../models/userModel');
const Tournament = require('./../models/tournamentModel');
const catchAsync = require('./../utilits/catchAsync');
const Booking = require('../models/bookingModel');
const AppError = require('../utilits/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  //1) get the tour data from collecation
  const Tournaments = await Tournament.find();
  //2) build template
  //3) rendet the template using the tour data feom 1)
  res.status(200).render('overview', {
    tittle: 'All Tournament',
    Tournaments
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tournament);
  const tours = await Tournament.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tournaments',
    tours
  });
});

exports.getTournament = catchAsync(async (req, res, next) => {
  //1)
  const tournament = await Tournament.findOne({
    slug: req.params.slug
  });
  if (!tournament) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  res.status(200).render('tournament', {
    tittle: `${tournament.name}`,
    tournament
  });
});
exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    tittle: `login`
  });
});
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
