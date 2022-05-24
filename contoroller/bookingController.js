const stripe = require('stripe')(
  `sk_test_51KyGlcABRDK75FiwvwCovpy4U52JCDLsRI4YhMfR4m6XH9gEByzgKNvx9CfjoCICWGuo5OwAZs5vVyNl24DSN4RE00Pltlkk4C`
);
const Tournament = require('../models/tournamentModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utilits/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  // console.log()
  const tour = await Tournament.findById(req.params.tournamentId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tournament/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tournamentId,
    line_items: [
      {
        name: `${tour.name} Tournament`,
        images: [
          `https://cdn.dribbble.com/assets/default_avatars/avatar-8-8e414ef7f6439f053182f89952e0c07a64ebb889f65561a37fb8804dd9cd2d33.png`
        ],
        amount: tour.fee * 100,
        currency: 'usd',
        quantity: 1
      }
    ],
    mode: 'payment'
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  const tournament = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_details.email }))
    .id;
  const price = session.amount_total / 100;
  await Booking.create({ tournament, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      'whsec_9cc6cfc72db134d3d3b7ad9cc4021b2e5fe4b61f8aba9bf188ab12d759325b3f'
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
