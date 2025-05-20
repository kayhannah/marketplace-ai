const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and tracking
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders with filters and pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplexResponse'
 *             examples:
 *               SearchResults:
 *                 $ref: '#/components/examples/ComplexScenarios/SearchResults'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               OrderExample:
 *                 $ref: '#/components/examples/OrderExample'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               note:
 *                 type: string
 *           examples:
 *             UpdateOrderStatus:
 *               value:
 *                 status: shipped
 *                 note: 'Order shipped via FedEx.'
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingUpdated:
 *                 $ref: '#/components/examples/ResponseExamples/ListingUpdated'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/orders/listings/{listingId}:
 *   post:
 *     summary: Create a new order for a listing
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 $ref: '#/components/schemas/Order/properties/shippingAddress'
 *               paymentMethodId:
 *                 type: string
 *                 description: Payment method ID
 *           examples:
 *             CreateOrder:
 *               value:
 *                 shippingAddress:
 *                   street: '123 Main St'
 *                   city: 'New York'
 *                   state: 'NY'
 *                   country: 'USA'
 *                   zipCode: '10001'
 *                 paymentMethodId: 'pm_1Hh1Y2A3B4C5D6E7F8G9H0'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               OrderExample:
 *                 $ref: '#/components/examples/OrderExample'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *
 * /api/orders/{orderId}/shipping:
 *   patch:
 *     summary: Update shipping information for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order/properties/shippingAddress'
 *           examples:
 *             UpdateShipping:
 *               value:
 *                 street: '456 Elm St'
 *                 city: 'Boston'
 *                 state: 'MA'
 *                 country: 'USA'
 *                 zipCode: '02118'
 *     responses:
 *       200:
 *         description: Shipping information updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingUpdated:
 *                 $ref: '#/components/examples/ResponseExamples/ListingUpdated'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/orders/{orderId}/refund:
 *   post:
 *     summary: Process a refund for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Refund amount
 *               reason:
 *                 type: string
 *                 description: Reason for refund
 *           examples:
 *             ProcessRefund:
 *               value:
 *                 amount: 5000
 *                 reason: 'Item not as described'
 *     responses:
 *       200:
 *         description: Refund processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               PaymentProcessed:
 *                 $ref: '#/components/examples/ResponseExamples/PaymentProcessed'
 *       400:
 *         description: Invalid input or refund not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               PaymentError:
 *                 $ref: '#/components/examples/ErrorExamples/PaymentError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/orders/{orderId}/notes:
 *   post:
 *     summary: Add a note to an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: Note to add to the order
 *           examples:
 *             AddNote:
 *               value:
 *                 note: 'Customer requested expedited shipping.'
 *     responses:
 *       200:
 *         description: Note added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Note added
 *                   data: null
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/orders/stats:
 *   get:
 *     summary: Get order statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplexResponse'
 *             examples:
 *               AnalyticsReport:
 *                 $ref: '#/components/examples/ComplexScenarios/AnalyticsReport'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 */
router.get('/', auth, orderController.getOrders);

router.get('/:orderId', auth, orderController.getOrder);

router.post('/:orderId/cancel', auth, orderController.cancelOrder);

router.post('/:orderId/tracking', auth, orderController.updateTracking);

router.patch('/:orderId/status', auth, orderController.updateStatus);

router.post('/:orderId/review', auth, orderController.submitReview);

// Create a new order
router.post('/listings/:listingId', orderController.createOrder);

// Update shipping information
router.patch('/:orderId/shipping', orderController.updateShipping);

// Process refund
router.post('/:orderId/refund', orderController.processRefund);

// Add note to order
router.post('/:orderId/notes', orderController.addNote);

// Get order statistics
router.get('/stats', orderController.getOrderStats);

module.exports = router; 