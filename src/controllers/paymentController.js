const stripeService = require('../services/payment/stripeService');
const Listing = require('../models/Listing');
const User = require('../models/User');

const paymentController = {
  // Create a payment intent for a sale
  async createPaymentIntent(req, res) {
    try {
      const { listingId } = req.params;
      const listing = await Listing.findById(listingId);

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      if (listing.status !== 'active') {
        return res.status(400).json({ error: 'Listing is not available for purchase' });
      }

      const paymentIntent = await stripeService.createPaymentIntent(listing.price);
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        amount: listing.price
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  },

  // Create a subscription for a rental
  async createRentalSubscription(req, res) {
    try {
      const { listingId } = req.params;
      const { duration } = req.body; // 'daily', 'weekly', or 'monthly'
      
      const listing = await Listing.findById(listingId);
      if (!listing || listing.listingType !== 'rent') {
        return res.status(404).json({ error: 'Rental listing not found' });
      }

      // Get or create Stripe customer
      let customer = await User.findById(req.user._id).select('stripeCustomerId');
      if (!customer.stripeCustomerId) {
        const stripeCustomer = await stripeService.createCustomer(req.user.email, req.user.name);
        customer.stripeCustomerId = stripeCustomer.id;
        await customer.save();
      }

      // Create subscription based on duration
      const priceId = listing.rentalDetails[`${duration}Rate`];
      const subscription = await stripeService.createSubscription(
        customer.stripeCustomerId,
        priceId
      );

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      });
    } catch (error) {
      console.error('Error creating rental subscription:', error);
      res.status(500).json({ error: 'Failed to create rental subscription' });
    }
  },

  // Handle Stripe webhook
  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      await stripeService.handleWebhook(event);
      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Failed to handle webhook' });
    }
  },

  // Process a refund
  async processRefund(req, res) {
    try {
      const { paymentIntentId } = req.params;
      const { amount } = req.body;

      const refund = await stripeService.refundPayment(paymentIntentId, amount);
      
      res.json({
        success: true,
        refund
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ error: 'Failed to process refund' });
    }
  }
};

module.exports = paymentController; 