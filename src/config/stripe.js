
const stripe = require('stripe')(process.env.secretKeyStripe);
module.exports = {
    createPaymentIntent: async function (amount, currency) {
        return await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
    },
};