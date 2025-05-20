const User = require('../../models/User');
const Listing = require('../../models/Listing');
const Order = require('../../models/Order');
const Notification = require('../../models/Notification');

class AdminService {
  // User Management
  async getUsers(query = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.isAdmin;

    Object.assign(user, updateData);
    await user.save();
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.remove();
  }

  // Listing Management
  async getListings(query = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const listings = await Listing.find(query)
      .populate('seller', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Listing.countDocuments(query);
    return { listings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateListing(listingId, updateData) {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    Object.assign(listing, updateData);
    await listing.save();
    return listing;
  }

  async deleteListing(listingId) {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    await listing.remove();
  }

  // Order Management
  async getOrders(query = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('listing')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateOrder(orderId, updateData) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    Object.assign(order, updateData);
    await order.save();
    return order;
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalListings,
      totalOrders,
      totalRevenue,
      recentUsers,
      recentListings,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      Listing.find().sort({ createdAt: -1 }).limit(5).populate('seller', 'name email'),
      Order.find().sort({ createdAt: -1 }).limit(5)
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .populate('listing')
    ]);

    return {
      totalUsers,
      totalListings,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentUsers,
      recentListings,
      recentOrders
    };
  }

  // System Notifications
  async createSystemNotification(title, message, priority = 'medium') {
    const users = await User.find({});
    const notifications = users.map(user => ({
      recipient: user._id,
      type: 'system_alert',
      title,
      message,
      priority
    }));

    await Notification.insertMany(notifications);
  }
}

module.exports = new AdminService(); 