const auctionService = require('../services/auction/auctionService');

const auctionController = {
  // Place a bid
  async placeBid(req, res) {
    try {
      const { listingId } = req.params;
      const { bidAmount } = req.body;
      const userId = req.user._id;

      const listing = await auctionService.placeBid(listingId, userId, bidAmount);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Buy now
  async buyNow(req, res) {
    try {
      const { listingId } = req.params;
      const userId = req.user._id;

      const listing = await auctionService.buyNow(listingId, userId);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Start an auction
  async startAuction(req, res) {
    try {
      const { listingId } = req.params;
      const listing = await auctionService.startAuction(listingId);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // End an auction
  async endAuction(req, res) {
    try {
      const { listingId } = req.params;
      const { winnerId, isBuyNow } = req.body;

      const result = await auctionService.endAuction(listingId, winnerId, isBuyNow);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cancel an auction
  async cancelAuction(req, res) {
    try {
      const { listingId } = req.params;
      const listing = await auctionService.cancelAuction(listingId);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get auction status
  async getAuctionStatus(req, res) {
    try {
      const { listingId } = req.params;
      const status = await auctionService.getAuctionStatus(listingId);
      res.json(status);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = auctionController; 