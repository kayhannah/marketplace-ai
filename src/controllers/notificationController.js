const notificationService = require('../services/notification/notificationService');

const notificationController = {
  // Get user's notifications
  async getNotifications(req, res) {
    try {
      const options = {
        unreadOnly: req.query.unreadOnly === 'true',
        type: req.query.type,
        limit: parseInt(req.query.limit) || 20
      };

      const notifications = await notificationService.getUserNotifications(
        req.user._id,
        options
      );
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get unread notifications count
  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.user._id);
      res.json({ count });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const notification = await notificationService.markAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      await notificationService.markAllAsRead(req.user._id);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete notification
  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      await notificationService.deleteNotification(notificationId);
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update notification preferences
  async updatePreferences(req, res) {
    try {
      const { email, push, sms } = req.body;
      const user = req.user;

      user.notificationPreferences = {
        email: email ?? user.notificationPreferences?.email,
        push: push ?? user.notificationPreferences?.push,
        sms: sms ?? user.notificationPreferences?.sms
      };

      await user.save();
      res.json(user.notificationPreferences);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = notificationController; 