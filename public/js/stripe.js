/* eslint-disable */
//import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tournamentId => {
  try {
    console.log(tournamentId, '😙');

    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/booking/checkout-session/${tournamentId}`
    );

    // 2) Create checkout form + chanre credit card
    console.log('1st vgc');
    const stripe = await loadStripe(
      'pk_test_51KyGlcABRDK75FiwB07Q6FTNMj1JfqLyPpCsyG4RgBWuvWfgT4pNaEwMU58175Eya6qI0pTjKbmoKDsNy8jNKfQ6003oGf1dnF'
    );
    console.log('2st vgc');

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};
