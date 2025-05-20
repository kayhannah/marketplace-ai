const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true
  },
  brand: {
    type: String
  },
  color: {
    type: String
  },
  size: {
    type: String
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  listingType: {
    type: String,
    enum: ['sale', 'rent', 'auction'],
    required: true
  },
  // Rental specific fields
  rentalDetails: {
    dailyRate: {
      type: Number,
      required: function() { return this.listingType === 'rent'; }
    },
    weeklyRate: {
      type: Number,
      required: function() { return this.listingType === 'rent'; }
    },
    monthlyRate: {
      type: Number,
      required: function() { return this.listingType === 'rent'; }
    },
    minimumRentalPeriod: {
      type: Number,
      required: function() { return this.listingType === 'rent'; },
      default: 1
    },
    availableFrom: {
      type: Date,
      required: function() { return this.listingType === 'rent'; }
    },
    availableTo: {
      type: Date,
      required: function() { return this.listingType === 'rent'; }
    },
    securityDeposit: {
      type: Number,
      required: function() { return this.listingType === 'rent'; }
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    bookings: [{
      renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      startDate: Date,
      endDate: Date,
      totalPrice: Number,
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
      },
      paymentIntentId: String,
      securityDepositStatus: {
        type: String,
        enum: ['pending', 'held', 'released', 'deducted'],
        default: 'pending'
      },
      cancellationReason: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    unavailableDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  // Auction specific fields
  auctionDetails: {
    startPrice: {
      type: Number,
      required: function() { return this.listingType === 'auction'; }
    },
    currentPrice: {
      type: Number,
      required: function() { return this.listingType === 'auction'; }
    },
    buyNowPrice: {
      type: Number,
      validate: {
        validator: function(value) {
          if (this.listingType === 'auction') {
            return value > this.auctionDetails.startPrice;
          }
          return true;
        },
        message: 'Buy Now price must be higher than the starting price'
      }
    },
    startTime: {
      type: Date,
      required: function() { return this.listingType === 'auction'; }
    },
    endTime: {
      type: Date,
      required: function() { return this.listingType === 'auction'; }
    },
    minimumBidIncrement: {
      type: Number,
      required: function() { return this.listingType === 'auction'; },
      default: 1
    },
    bids: [{
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      timestamp: {
        type: Date,
        default: Date.now
      },
      isBuyNow: {
        type: Boolean,
        default: false
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'active', 'ended', 'cancelled', 'sold'],
      default: 'pending'
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // AI generated fields
  aiAnalysis: {
    objectType: String,
    brand: String,
    color: String,
    size: String,
    condition: String,
    estimatedValue: Number,
    confidence: Number
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
listingSchema.index({ location: '2dsphere' });

// Index for text search
listingSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text',
  category: 'text'
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing; 