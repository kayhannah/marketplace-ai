const Listing = require('../../models/Listing');
const stripeService = require('../payment/stripeService');

class RentalService {
  // Calculate rental price based on duration and rate type
  calculateRentalPrice(listing, startDate, endDate) {
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    let totalPrice = 0;
    
    // Calculate weekly rate
    if (weeks > 0) {
      totalPrice += weeks * listing.rentalDetails.weeklyRate;
    }
    
    // Calculate daily rate for remaining days
    if (remainingDays > 0) {
      totalPrice += remainingDays * listing.rentalDetails.dailyRate;
    }

    return {
      totalPrice,
      days,
      weeks,
      remainingDays
    };
  }

  // Check if dates are available
  async checkAvailability(listingId, startDate, endDate) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    // Check if dates are within available range
    if (startDate < listing.rentalDetails.availableFrom || 
        endDate > listing.rentalDetails.availableTo) {
      return false;
    }

    // Check for existing bookings
    const conflictingBooking = listing.rentalDetails.bookings.find(booking => {
      return (
        (startDate >= booking.startDate && startDate < booking.endDate) ||
        (endDate > booking.startDate && endDate <= booking.endDate) ||
        (startDate <= booking.startDate && endDate >= booking.endDate)
      );
    });

    // Check unavailable dates
    const unavailablePeriod = listing.rentalDetails.unavailableDates.find(period => {
      return (
        (startDate >= period.startDate && startDate < period.endDate) ||
        (endDate > period.startDate && endDate <= period.endDate) ||
        (startDate <= period.startDate && endDate >= period.endDate)
      );
    });

    return !conflictingBooking && !unavailablePeriod;
  }

  // Create a rental booking
  async createBooking(listingId, userId, startDate, endDate) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    // Check availability
    const isAvailable = await this.checkAvailability(listingId, startDate, endDate);
    if (!isAvailable) {
      throw new Error('Selected dates are not available');
    }

    // Calculate price
    const { totalPrice } = this.calculateRentalPrice(listing, startDate, endDate);

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      totalPrice + listing.rentalDetails.securityDeposit
    );

    // Create booking
    const booking = {
      renter: userId,
      startDate,
      endDate,
      totalPrice,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
      paymentStatus: 'pending',
      securityDepositStatus: 'pending'
    };

    listing.rentalDetails.bookings.push(booking);
    await listing.save();

    return {
      listing,
      paymentIntent
    };
  }

  // Confirm a booking
  async confirmBooking(listingId, bookingId) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    const booking = listing.rentalDetails.bookings.id(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.securityDepositStatus = 'held';
    await listing.save();

    return listing;
  }

  // Cancel a booking
  async cancelBooking(listingId, bookingId, reason) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    const booking = listing.rentalDetails.bookings.id(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Apply cancellation policy
    const now = new Date();
    const daysUntilStart = Math.ceil((booking.startDate - now) / (1000 * 60 * 60 * 24));
    
    let refundAmount = 0;
    switch (listing.rentalDetails.cancellationPolicy) {
      case 'flexible':
        refundAmount = booking.totalPrice;
        break;
      case 'moderate':
        if (daysUntilStart >= 7) {
          refundAmount = booking.totalPrice;
        } else if (daysUntilStart >= 3) {
          refundAmount = booking.totalPrice * 0.5;
        }
        break;
      case 'strict':
        if (daysUntilStart >= 14) {
          refundAmount = booking.totalPrice;
        } else if (daysUntilStart >= 7) {
          refundAmount = booking.totalPrice * 0.5;
        }
        break;
    }

    // Process refund if applicable
    if (refundAmount > 0) {
      await stripeService.refundPayment(booking.paymentIntentId, refundAmount);
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.securityDepositStatus = 'released';
    booking.cancellationReason = reason;
    await listing.save();

    return listing;
  }

  // Complete a rental
  async completeRental(listingId, bookingId) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    const booking = listing.rentalDetails.bookings.id(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = 'completed';
    booking.securityDepositStatus = 'released';
    await listing.save();

    return listing;
  }

  // Get rental availability
  async getAvailability(listingId, startDate, endDate) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'rent') {
      throw new Error('Listing not found or not a rental');
    }

    const isAvailable = await this.checkAvailability(listingId, startDate, endDate);
    const { totalPrice, days, weeks, remainingDays } = this.calculateRentalPrice(
      listing,
      startDate,
      endDate
    );

    return {
      isAvailable,
      totalPrice,
      days,
      weeks,
      remainingDays,
      securityDeposit: listing.rentalDetails.securityDeposit
    };
  }
}

module.exports = new RentalService(); 