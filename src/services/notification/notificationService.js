const Notification = require('../../models/Notification');
const User = require('../../models/User');

class NotificationService {
  // Create and send a notification
  async createNotification(data) {
    try {
      const notification = await Notification.createNotification(data);
      await this.sendNotification(notification);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send notification through appropriate channels
  async sendNotification(notification) {
    try {
      const user = await User.findById(notification.recipient);
      if (!user) {
        throw new Error('User not found');
      }

      // Update delivery status
      notification.deliveryStatus = 'sent';
      notification.deliveryAttempts += 1;
      notification.lastDeliveryAttempt = new Date();
      await notification.save();

      // Send through different channels based on user preferences
      if (user.notificationPreferences?.email) {
        await this.sendEmailNotification(notification, user);
      }

      if (user.notificationPreferences?.push) {
        await this.sendPushNotification(notification, user);
      }

      if (user.notificationPreferences?.sms) {
        await this.sendSMSNotification(notification, user);
      }

      // Update delivery status
      notification.deliveryStatus = 'delivered';
      await notification.save();

    } catch (error) {
      console.error('Error sending notification:', error);
      notification.deliveryStatus = 'failed';
      await notification.save();
      throw error;
    }
  }

  // Send email notification
  async sendEmailNotification(notification, user) {
    // TODO: Implement email sending logic
    console.log(`Sending email to ${user.email}: ${notification.title}`);
  }

  // Send push notification
  async sendPushNotification(notification, user) {
    // TODO: Implement push notification logic
    console.log(`Sending push notification to ${user._id}: ${notification.title}`);
  }

  // Send SMS notification
  async sendSMSNotification(notification, user) {
    // TODO: Implement SMS sending logic
    console.log(`Sending SMS to ${user.phone}: ${notification.title}`);
  }

  // Get user's notifications
  async getUserNotifications(userId, options = {}) {
    const query = { recipient: userId };
    
    if (options.unreadOnly) {
      query.read = false;
    }

    if (options.type) {
      query.type = options.type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 20)
      .populate('relatedEntities.order')
      .populate('relatedEntities.listing')
      .populate('relatedEntities.user', 'name email');

    return notifications;
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification.markAsRead();
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
  }

  // Delete notification
  async deleteNotification(notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    await notification.remove();
  }

  // Get unread notifications count
  async getUnreadCount(userId) {
    return Notification.getUnreadCount(userId);
  }

  // Create order-related notifications
  async createOrderNotification(order, type) {
    const notifications = [];

    // Notify buyer
    notifications.push({
      recipient: order.buyer,
      type: `order_${type}`,
      title: `Order ${type.replace('_', ' ')}`,
      message: `Your order #${order.orderNumber} has been ${type.replace('_', ' ')}`,
      priority: 'high',
      relatedEntities: {
        order: order._id,
        listing: order.listing
      }
    });

    // Notify seller
    notifications.push({
      recipient: order.seller,
      type: `order_${type}`,
      title: `Order ${type.replace('_', ' ')}`,
      message: `Order #${order.orderNumber} has been ${type.replace('_', ' ')}`,
      priority: 'high',
      relatedEntities: {
        order: order._id,
        listing: order.listing
      }
    });

    // Create notifications
    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }

  // Create auction-related notifications
  async createAuctionNotification(auction, type, bidder = null) {
    const notifications = [];

    // Notify seller
    notifications.push({
      recipient: auction.seller,
      type: `auction_${type}`,
      title: `Auction ${type.replace('_', ' ')}`,
      message: `Your auction "${auction.title}" has been ${type.replace('_', ' ')}`,
      priority: 'high',
      relatedEntities: {
        listing: auction._id
      }
    });

    // Notify bidder if applicable
    if (bidder) {
      notifications.push({
        recipient: bidder,
        type: `auction_${type}`,
        title: `Auction ${type.replace('_', ' ')}`,
        message: `Your bid on "${auction.title}" has been ${type.replace('_', ' ')}`,
        priority: 'high',
        relatedEntities: {
          listing: auction._id
        }
      });
    }

    // Create notifications
    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }

  // Create rental-related notifications
  async createRentalNotification(rental, type, renter = null) {
    const notifications = [];

    // Notify owner
    notifications.push({
      recipient: rental.seller,
      type: `rental_${type}`,
      title: `Rental ${type.replace('_', ' ')}`,
      message: `Your rental "${rental.title}" has been ${type.replace('_', ' ')}`,
      priority: 'high',
      relatedEntities: {
        listing: rental._id
      }
    });

    // Notify renter if applicable
    if (renter) {
      notifications.push({
        recipient: renter,
        type: `rental_${type}`,
        title: `Rental ${type.replace('_', ' ')}`,
        message: `Your rental request for "${rental.title}" has been ${type.replace('_', ' ')}`,
        priority: 'high',
        relatedEntities: {
          listing: rental._id
        }
      });
    }

    // Create notifications
    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }
}

module.exports = new NotificationService(); 