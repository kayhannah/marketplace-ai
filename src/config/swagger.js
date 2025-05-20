const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace AI API',
      version: '1.0.0',
      description: 'API documentation for the Marketplace AI platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for webhook authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User\'s full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            phone: {
              type: 'string',
              description: 'User\'s phone number',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
                zipCode: { type: 'string' },
              },
            },
            notificationPreferences: {
              type: 'object',
              properties: {
                email: { type: 'boolean' },
                push: { type: 'boolean' },
                sms: { type: 'boolean' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Listing: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Listing ID',
            },
            title: {
              type: 'string',
              description: 'Listing title',
            },
            description: {
              type: 'string',
              description: 'Listing description',
            },
            price: {
              type: 'number',
              description: 'Listing price',
            },
            type: {
              type: 'string',
              enum: ['sale', 'auction', 'rental'],
              description: 'Listing type',
            },
            category: {
              type: 'string',
              description: 'Listing category',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of image URLs',
            },
            status: {
              type: 'string',
              enum: ['active', 'pending', 'sold', 'cancelled'],
              description: 'Listing status',
            },
            seller: {
              $ref: '#/components/schemas/User',
            },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'] },
                coordinates: {
                  type: 'array',
                  items: { type: 'number' },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID',
            },
            listing: {
              $ref: '#/components/schemas/Listing',
            },
            buyer: {
              $ref: '#/components/schemas/User',
            },
            seller: {
              $ref: '#/components/schemas/User',
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status',
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount',
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'refunded', 'failed'],
              description: 'Payment status',
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
                zipCode: { type: 'string' },
              },
            },
            tracking: {
              type: 'object',
              properties: {
                carrier: { type: 'string' },
                trackingNumber: { type: 'string' },
                estimatedDelivery: { type: 'string', format: 'date-time' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Notification ID',
            },
            recipient: {
              $ref: '#/components/schemas/User',
            },
            type: {
              type: 'string',
              enum: ['order_created', 'payment_received', 'refund_processed', 'auction_ended', 'rental_request', 'system'],
              description: 'Notification type',
            },
            title: {
              type: 'string',
              description: 'Notification title',
            },
            message: {
              type: 'string',
              description: 'Notification message',
            },
            data: {
              type: 'object',
              description: 'Additional notification data',
            },
            read: {
              type: 'boolean',
              description: 'Whether the notification has been read',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Notification priority',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Error status',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
              description: 'Validation errors',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total number of items',
            },
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages',
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
            },
          },
        },
        Auction: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Auction ID',
            },
            listing: {
              $ref: '#/components/schemas/Listing',
            },
            startPrice: {
              type: 'number',
              description: 'Starting price in cents/smallest currency unit',
            },
            currentPrice: {
              type: 'number',
              description: 'Current highest bid amount',
            },
            minimumBidIncrement: {
              type: 'number',
              description: 'Minimum amount for each bid increment',
            },
            buyNowPrice: {
              type: 'number',
              description: 'Optional buy now price',
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Auction start time',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Auction end time',
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'ended', 'cancelled'],
              description: 'Auction status',
            },
            bids: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  bidder: { $ref: '#/components/schemas/User' },
                  amount: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
              description: 'Array of bids placed',
            },
            winner: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                bidAmount: { type: 'number' },
                timestamp: { type: 'string', format: 'date-time' },
              },
              description: 'Winning bid information',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Rental: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Rental ID',
            },
            listing: {
              $ref: '#/components/schemas/Listing',
            },
            renter: {
              $ref: '#/components/schemas/User',
            },
            owner: {
              $ref: '#/components/schemas/User',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental start date',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental end date',
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'completed', 'cancelled'],
              description: 'Rental status',
            },
            totalAmount: {
              type: 'number',
              description: 'Total rental amount',
            },
            securityDeposit: {
              type: 'number',
              description: 'Security deposit amount',
            },
            specialRequests: {
              type: 'string',
              description: 'Any special requests or requirements',
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'refunded', 'failed'],
              description: 'Payment status',
            },
            extensions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  newEndDate: { type: 'string', format: 'date-time' },
                  status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                  additionalAmount: { type: 'number' },
                  reason: { type: 'string' },
                },
              },
              description: 'Rental extension requests',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        BidRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              description: 'Bid amount in cents/smallest currency unit',
            },
          },
        },
        RentalRequest: {
          type: 'object',
          required: ['startDate', 'endDate'],
          properties: {
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental start date',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental end date',
            },
            specialRequests: {
              type: 'string',
              description: 'Any special requests or requirements',
            },
          },
        },
        ExtensionRequest: {
          type: 'object',
          required: ['newEndDate'],
          properties: {
            newEndDate: {
              type: 'string',
              format: 'date-time',
              description: 'New rental end date',
            },
            reason: {
              type: 'string',
              description: 'Reason for extension',
            },
          },
        },
        CancelRequest: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: {
              type: 'string',
              description: 'Reason for cancellation',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        ListResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Array of items',
            },
            pagination: {
              $ref: '#/components/schemas/Pagination',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Payment ID',
            },
            amount: {
              type: 'number',
              description: 'Payment amount in cents/smallest currency unit',
            },
            currency: {
              type: 'string',
              description: 'Payment currency (e.g., USD)',
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
              description: 'Payment status',
            },
            paymentMethod: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['card', 'bank_transfer', 'digital_wallet'],
                },
                last4: { type: 'string' },
                brand: { type: 'string' },
                expiryMonth: { type: 'integer' },
                expiryYear: { type: 'integer' },
              },
            },
            relatedEntity: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['order', 'auction', 'rental'],
                },
                id: { type: 'string' },
              },
            },
            refunds: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                  reason: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: ['pending', 'completed', 'failed'],
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            metadata: {
              type: 'object',
              description: 'Additional payment metadata',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Review ID',
            },
            listing: {
              $ref: '#/components/schemas/Listing',
            },
            reviewer: {
              $ref: '#/components/schemas/User',
            },
            reviewee: {
              $ref: '#/components/schemas/User',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5',
            },
            comment: {
              type: 'string',
              description: 'Review comment',
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of image URLs',
            },
            response: {
              type: 'object',
              properties: {
                comment: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
            helpfulVotes: {
              type: 'integer',
              description: 'Number of helpful votes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WebhookEvent: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique webhook event ID',
            },
            type: {
              type: 'string',
              enum: [
                'payment.succeeded',
                'payment.failed',
                'payment.refunded',
                'payment.disputed',
                'payment.dispute.resolved',
                'payment.method.added',
                'payment.method.removed',
                'auction.created',
                'auction.started',
                'auction.ended',
                'auction.cancelled',
                'auction.bid_placed',
                'auction.bid_outbid',
                'auction.buy_now',
                'rental.requested',
                'rental.approved',
                'rental.rejected',
                'rental.started',
                'rental.ended',
                'rental.cancelled',
                'rental.extended',
                'order.created',
                'order.updated',
                'order.cancelled',
                'order.shipped',
                'order.delivered',
                'order.returned',
                'review.created',
                'review.updated',
                'review.deleted',
                'review.flagged',
                'user.registered',
                'user.verified',
                'user.suspended',
                'user.deleted',
                'system.maintenance',
                'system.update',
                'system.alert',
              ],
              description: 'Type of webhook event',
            },
            data: {
              type: 'object',
              description: 'Event-specific data',
            },
            metadata: {
              type: 'object',
              description: 'Additional event metadata',
              properties: {
                source: { type: 'string' },
                version: { type: 'string' },
                environment: { type: 'string' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ComplexResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            metadata: {
              type: 'object',
              description: 'Additional response metadata',
              properties: {
                processingTime: { type: 'number' },
                serverTime: { type: 'string', format: 'date-time' },
                pagination: { $ref: '#/components/schemas/Pagination' },
                filters: { type: 'object' },
                sorting: { type: 'object' },
              },
            },
            warnings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  details: { type: 'object' },
                },
              },
            },
          },
        },
        SearchFilters: {
          type: 'object',
          properties: {
            priceRange: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
              },
            },
            categories: {
              type: 'array',
              items: { type: 'string' },
            },
            location: {
              type: 'object',
              properties: {
                radius: { type: 'number' },
                coordinates: {
                  type: 'array',
                  items: { type: 'number' },
                },
              },
            },
            dateRange: {
              type: 'object',
              properties: {
                start: { type: 'string', format: 'date-time' },
                end: { type: 'string', format: 'date-time' },
              },
            },
            status: {
              type: 'array',
              items: { type: 'string' },
            },
            features: {
              type: 'object',
              additionalProperties: { type: 'boolean' },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec; 