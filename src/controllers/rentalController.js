const rentalService = require('../services/rental/rentalService');

const rentalController = {
  // Check availability and get price
  async checkAvailability(req, res) {
    try {
      const { listingId } = req.params;
      const { startDate, endDate } = req.body;

      const availability = await rentalService.getAvailability(
        listingId,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(availability);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Create a booking
  async createBooking(req, res) {
    try {
      const { listingId } = req.params;
      const { startDate, endDate } = req.body;
      const userId = req.user._id;

      const result = await rentalService.createBooking(
        listingId,
        userId,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Confirm a booking
  async confirmBooking(req, res) {
    try {
      const { listingId, bookingId } = req.params;
      const listing = await rentalService.confirmBooking(listingId, bookingId);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cancel a booking
  async cancelBooking(req, res) {
    try {
      const { listingId, bookingId } = req.params;
      const { reason } = req.body;
      const listing = await rentalService.cancelBooking(listingId, bookingId, reason);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Complete a rental
  async completeRental(req, res) {
    try {
      const { listingId, bookingId } = req.params;
      const listing = await rentalService.completeRental(listingId, bookingId);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = rentalController; 