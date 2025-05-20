const Listing = require('../../models/Listing');
const stripeService = require('../payment/stripeService');

class AuctionService {
  // Place a bid on an auction
  async placeBid(listingId, userId, bidAmount) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    if (listing.auctionDetails.status !== 'active') {
      throw new Error('Auction is not active');
    }

    if (new Date() > listing.auctionDetails.endTime) {
      throw new Error('Auction has ended');
    }

    if (bidAmount <= listing.auctionDetails.currentPrice) {
      throw new Error('Bid must be higher than current price');
    }

    if (bidAmount < listing.auctionDetails.currentPrice + listing.auctionDetails.minimumBidIncrement) {
      throw new Error(`Bid must be at least ${listing.auctionDetails.minimumBidIncrement} more than current price`);
    }

    // Add the bid
    listing.auctionDetails.bids.push({
      bidder: userId,
      amount: bidAmount,
      timestamp: new Date()
    });

    // Update current price
    listing.auctionDetails.currentPrice = bidAmount;

    // Check if bid meets buy now price
    if (listing.auctionDetails.buyNowPrice && bidAmount >= listing.auctionDetails.buyNowPrice) {
      await this.endAuction(listingId, userId, true);
    }

    await listing.save();
    return listing;
  }

  // Buy now
  async buyNow(listingId, userId) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    if (!listing.auctionDetails.buyNowPrice) {
      throw new Error('Buy Now price not set for this auction');
    }

    if (listing.auctionDetails.status !== 'active') {
      throw new Error('Auction is not active');
    }

    // Add the buy now bid
    listing.auctionDetails.bids.push({
      bidder: userId,
      amount: listing.auctionDetails.buyNowPrice,
      timestamp: new Date(),
      isBuyNow: true
    });

    // End the auction
    await this.endAuction(listingId, userId, true);
    return listing;
  }

  // End an auction
  async endAuction(listingId, winnerId = null, isBuyNow = false) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    if (listing.auctionDetails.status !== 'active') {
      throw new Error('Auction is not active');
    }

    // If no winner provided, find the highest bidder
    if (!winnerId && !isBuyNow) {
      const highestBid = listing.auctionDetails.bids.reduce((prev, current) => 
        (prev.amount > current.amount) ? prev : current
      );
      winnerId = highestBid.bidder;
    }

    // Update auction status
    listing.auctionDetails.status = 'ended';
    listing.auctionDetails.winner = winnerId;
    listing.status = 'sold';

    // Create payment intent for the winner
    const paymentIntent = await stripeService.createPaymentIntent(
      isBuyNow ? listing.auctionDetails.buyNowPrice : listing.auctionDetails.currentPrice
    );

    await listing.save();
    return {
      listing,
      paymentIntent
    };
  }

  // Start an auction
  async startAuction(listingId) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    if (listing.auctionDetails.status !== 'pending') {
      throw new Error('Auction cannot be started');
    }

    listing.auctionDetails.status = 'active';
    listing.auctionDetails.currentPrice = listing.auctionDetails.startPrice;
    await listing.save();
    return listing;
  }

  // Cancel an auction
  async cancelAuction(listingId) {
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    if (listing.auctionDetails.status === 'ended' || listing.auctionDetails.status === 'sold') {
      throw new Error('Cannot cancel ended or sold auction');
    }

    listing.auctionDetails.status = 'cancelled';
    await listing.save();
    return listing;
  }

  // Get auction status
  async getAuctionStatus(listingId) {
    const listing = await Listing.findById(listingId)
      .populate('auctionDetails.bids.bidder', 'name email')
      .populate('auctionDetails.winner', 'name email');
    
    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Listing not found or not an auction');
    }

    const now = new Date();
    const timeLeft = listing.auctionDetails.endTime - now;
    const isActive = listing.auctionDetails.status === 'active' && timeLeft > 0;

    return {
      status: listing.auctionDetails.status,
      currentPrice: listing.auctionDetails.currentPrice,
      buyNowPrice: listing.auctionDetails.buyNowPrice,
      timeLeft: timeLeft > 0 ? timeLeft : 0,
      isActive,
      bids: listing.auctionDetails.bids,
      winner: listing.auctionDetails.winner
    };
  }
}

module.exports = new AuctionService(); 