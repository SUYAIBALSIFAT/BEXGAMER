// const User = require('./../models/userModel');
const Tournament = require('../models/tournamentModel');
const catchAsync = require('../utilits/catchAsync');
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
exports.getTournaments = catchAsync(async (req, res) => {
  //1) get the tour data from collecation
  const Tournaments = await Tournament.find();
  //2) build template
  //3) rendet the template using the tour data feom 1)
  res.status(200).render('tournaments', {
    tittle: 'All Tournament',
    Tournaments
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tournament);
  const Tournaments = await Tournament.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tournaments',
    Tournaments
  });
});

exports.getTournament = catchAsync(async (req, res, next) => {
  //1)
  const tournament = await Tournament.findOne({
    slug: `${req.params.slug}`
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
    tittle: `Log into your account`
  });
});
exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    tittle: `Signup into your account`
  });
});
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
/* eslint-disable */
// Set the date we're counting down to

// Update the count down every 1 second
// const x = setInterval(function() {
//   // Get today's date and time
//   const now = new Date().getTime();

//   // Find the distance between now and the count down date
//   const distance = tournament.registrationEnds - now;

//   // Time calculations for days, hours, minutes and seconds
//   const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Display the result in the element with id="demo"
//   document.getElementById('demo').innerHTML =
//     days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

//   // If the count down is finished, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     document.getElementById('demo').innerHTML = 'EXPIRED';
//   }
// }, 1000);
