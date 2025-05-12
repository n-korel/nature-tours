/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
	'pk_test_51RM3UUB1Ca2t67Ul4QqggWvx2gUk04Tmag6NqNuOqwVBiGa7ZDNPhOuOXzDb591dE5M3m2gr5YMpOsiT4P0VpT3k009PGFLcn0',
);

export const bookTour = async (tourId) => {
	try {
		// 1. Get checkout session from API
		const session = await axios({
			url: `/api/v1/bookings/checkout-session/${tourId}`,
		});
		// console.log(session);

		// 2. Create checkout form + chanre credit card
		await stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (err) {
		console.log(err);
		showAlert('error', err);
	}
};
