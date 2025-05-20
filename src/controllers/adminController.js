const adminService = require('../services/admin/adminService');

const adminController = {
  // Dashboard
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // User Management
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, ...query } = req.query;
      const result = await adminService.getUsers(query, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await adminService.updateUser(userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await adminService.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listing Management
  async getListings(req, res) {
    try {
      const { page = 1, limit = 10, ...query } = req.query;
      const result = await adminService.getListings(query, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateListing(req, res) {
    try {
      const { listingId } = req.params;
      const listing = await adminService.updateListing(listingId, req.body);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteListing(req, res) {
    try {
      const { listingId } = req.params;
      await adminService.deleteListing(listingId);
      res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Order Management
  async getOrders(req, res) {
    try {
      const { page = 1, limit = 10, ...query } = req.query;
      const result = await adminService.getOrders(query, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await adminService.updateOrder(orderId, req.body);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // System Notifications
  async createSystemNotification(req, res) {
    try {
      const { title, message, priority } = req.body;
      await adminService.createSystemNotification(title, message, priority);
      res.json({ message: 'System notification created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = adminController; 