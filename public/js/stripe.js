/* eslint-disable */
//import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js/pure';

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tournamentId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tournamentId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    const stripe = await loadStripe(
      'pk_test_51KyGlcABRDK75FiwB07Q6FTNMj1JfqLyPpCsyG4RgBWuvWfgT4pNaEwMU58175Eya6qI0pTjKbmoKDsNy8jNKfQ6003oGf1dnF'
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
