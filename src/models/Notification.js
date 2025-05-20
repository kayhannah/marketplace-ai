const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'order_created',
      'order_status_changed',
      'payment_received',
      'payment_failed',
      'auction_bid',
      'auction_ended',
      'auction_won',
      'rental_request',
      'rental_confirmed',
      'rental_cancelled',
      'rental_completed',
      'refund_processed',
      'message_received',
      'review_received',
      'system_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  // For linking to related entities
  relatedEntities: {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // For scheduled notifications
  scheduledFor: {
    type: Date
  },
  // For tracking notification delivery
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  lastDeliveryAttempt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ deliveryStatus: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return this.save();
};

// Method to mark notification as unread
notificationSchema.methods.markAsUnread = async function() {
  this.read = false;
  return this.save();
};

// Static method to create a notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ recipient: userId, read: false });
};

// Static method to get recent notifications
notificationSchema.statics.getRecentNotifications = async function(userId, limit = 20) {
  return this.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('relatedEntities.order')
    .populate('relatedEntities.listing')
    .populate('relatedEntities.user', 'name email');
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 