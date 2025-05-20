const Order = require('../../models/Order');
const Listing = require('../../models/Listing');
const stripeService = require('../payment/stripeService');

class OrderService {
  // Create a new order
  async createOrder(listingId, buyerId, orderType, details = {}) {
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      throw new Error('Listing not found');
    }

    // Create order based on type
    const orderData = {
      buyer: buyerId,
      seller: listing.seller,
      listing: listingId,
      orderType,
      amount: listing.price,
      currency: 'usd',
      paymentIntentId: details.paymentIntentId,
      shippingAddress: details.shippingAddress
    };

    // Add type-specific details
    if (orderType === 'rent') {
      orderData.rentalDetails = {
        startDate: details.startDate,
        endDate: details.endDate,
        securityDeposit: listing.rentalDetails.securityDeposit,
        securityDepositStatus: 'pending'
      };
    } else if (orderType === 'auction') {
      orderData.auctionDetails = {
        winningBid: listing.auctionDetails.currentPrice,
        isBuyNow: details.isBuyNow || false
      };
    }

    const order = new Order(orderData);
    await order.save();

    return order;
  }

  // Get order by ID
  async getOrder(orderId) {
    const order = await Order.findById(orderId)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('listing');
    
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Get orders for a user (buyer or seller)
  async getUserOrders(userId, role = 'buyer', filters = {}) {
    const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
    
    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.orderType) {
      query.orderType = filters.orderType;
    }
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('listing')
      .sort({ createdAt: -1 });

    return orders;
  }

  // Update order status
  async updateOrderStatus(orderId, status, userId, note = null) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Add note if provided
    if (note) {
      order.notes.push({
        content: note,
        author: userId
      });
    }

    order.status = status;
    await order.save();

    return order;
  }

  // Update shipping information
  async updateShipping(orderId, shippingInfo) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    order.tracking = {
      ...order.tracking,
      ...shippingInfo
    };

    if (shippingInfo.trackingNumber) {
      order.status = 'shipped';
    }

    await order.save();
    return order;
  }

  // Process refund
  async processRefund(orderId, amount, reason, processedBy) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus !== 'paid') {
      throw new Error('Order is not paid');
    }

    // Process refund through Stripe
    await stripeService.refundPayment(order.paymentIntentId, amount);

    // Update order details
    order.paymentStatus = 'refunded';
    order.status = 'refunded';
    order.refundDetails = {
      amount,
      reason,
      processedAt: new Date(),
      processedBy
    };

    await order.save();
    return order;
  }

  // Add note to order
  async addNote(orderId, content, authorId) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    order.notes.push({
      content,
      author: authorId
    });

    await order.save();
    return order;
  }

  // Get order statistics
  async getOrderStats(userId, role = 'buyer', timeRange = 'month') {
    const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
    
    // Set date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    query.createdAt = { $gte: startDate };

    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return stats;
  }
}

module.exports = new OrderService(); 