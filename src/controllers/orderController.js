const orderService = require('../services/order/orderService');

const orderController = {
  // Create a new order
  async createOrder(req, res) {
    try {
      const { listingId } = req.params;
      const { orderType, details } = req.body;
      const userId = req.user._id;

      const order = await orderService.createOrder(listingId, userId, orderType, details);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get order by ID
  async getOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrder(orderId);
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Get user's orders
  async getUserOrders(req, res) {
    try {
      const { role = 'buyer' } = req.query;
      const filters = {
        status: req.query.status,
        orderType: req.query.orderType,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const orders = await orderService.getUserOrders(req.user._id, role, filters);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status, note } = req.body;
      const userId = req.user._id;

      const order = await orderService.updateOrderStatus(orderId, status, userId, note);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update shipping information
  async updateShipping(req, res) {
    try {
      const { orderId } = req.params;
      const shippingInfo = req.body;

      const order = await orderService.updateShipping(orderId, shippingInfo);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Process refund
  async processRefund(req, res) {
    try {
      const { orderId } = req.params;
      const { amount, reason } = req.body;
      const userId = req.user._id;

      const order = await orderService.processRefund(orderId, amount, reason, userId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Add note to order
  async addNote(req, res) {
    try {
      const { orderId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      const order = await orderService.addNote(orderId, content, userId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get order statistics
  async getOrderStats(req, res) {
    try {
      const { role = 'buyer', timeRange = 'month' } = req.query;
      const stats = await orderService.getOrderStats(req.user._id, role, timeRange);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = orderController; 