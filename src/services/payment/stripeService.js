const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  // Create a payment intent for a sale
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Create a subscription for rentals
  async createSubscription(customerId, priceId) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  // Create a customer
  async createCustomer(email, name) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  // Handle webhook events
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new Error('Failed to handle webhook');
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    // TODO: Update order status, notify seller, etc.
    console.log('Payment succeeded:', paymentIntent.id);
  }

  // Handle failed payment
  async handlePaymentFailure(paymentIntent) {
    // TODO: Notify user, update order status, etc.
    console.log('Payment failed:', paymentIntent.id);
  }

  // Handle subscription creation
  async handleSubscriptionCreated(subscription) {
    // TODO: Update rental status, notify parties, etc.
    console.log('Subscription created:', subscription.id);
  }

  // Handle subscription deletion
  async handleSubscriptionDeleted(subscription) {
    // TODO: Update rental status, notify parties, etc.
    console.log('Subscription deleted:', subscription.id);
  }

  // Refund a payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return refund;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw new Error('Failed to refund payment');
    }
  }
}

module.exports = new StripeService(); 