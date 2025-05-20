const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and management
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create a payment intent
 *     description: Creates a new payment intent for processing a payment.
 *     operationId: createPaymentIntent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *           examples:
 *             CreatePayment:
 *               $ref: '#/components/examples/RequestExamples/CreatePayment'
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               PaymentExample:
 *                 $ref: '#/components/examples/PaymentExample'
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
 */
router.post('/create-intent', auth, paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment
 *     description: Confirms a payment using a payment intent and method.
 *     operationId: confirmPayment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *           examples:
 *             ConfirmPayment:
 *               value:
 *                 paymentIntentId: 'pi_1Hh1Y2A3B4C5D6E7F8G9H0'
 *                 paymentMethodId: 'pm_1Hh1Y2A3B4C5D6E7F8G9H0'
 *     responses:
 *       200:
 *         description: Payment confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               PaymentProcessed:
 *                 $ref: '#/components/examples/ResponseExamples/PaymentProcessed'
 *       400:
 *         description: Invalid input or payment failed
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
 */
router.post('/confirm', auth, paymentController.confirmPayment);

/**
 * @swagger
 * /api/payments/methods:
 *   get:
 *     summary: Get saved payment methods
 *     description: Retrieves a list of saved payment methods for the user.
 *     operationId: getPaymentMethods
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               PaymentExample:
 *                 $ref: '#/components/examples/PaymentExample'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               AuthenticationError:
 *                 $ref: '#/components/examples/ErrorExamples/AuthenticationError'
 *   post:
 *     summary: Save a new payment method
 *     description: Saves a new payment method for the user.
 *     operationId: savePaymentMethod
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *           examples:
 *             SavePaymentMethod:
 *               value:
 *                 paymentMethodId: 'pm_1Hh1Y2A3B4C5D6E7F8G9H0'
 *     responses:
 *       200:
 *         description: Payment method saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Payment method saved
 *                   data: {}
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
 */
router.get('/methods', auth, paymentController.getPaymentMethods);
router.post('/methods', auth, paymentController.savePaymentMethod);

/**
 * @swagger
 * /api/payments/methods/{methodId}:
 *   delete:
 *     summary: Delete a saved payment method
 *     description: Deletes a saved payment method for the user.
 *     operationId: deletePaymentMethod
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: methodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Payment method deleted
 *                   data: {}
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
 *         description: Payment method not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.delete('/methods/:methodId', auth, paymentController.deletePaymentMethod);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Process a payment refund
 *     description: Processes a refund for a specific payment.
 *     operationId: processRefund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *           examples:
 *             ProcessRefund:
 *               value:
 *                 paymentId: 'pi_1Hh1Y2A3B4C5D6E7F8G9H0'
 *                 amount: 5000
 *                 reason: 'Duplicate charge'
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
 */
router.post('/refund', auth, paymentController.processRefund);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle payment provider webhook events
 *     description: Handles incoming webhook events from payment providers.
 *     operationId: handlePaymentWebhook
 *     tags: [Payments]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookEvent'
 *           examples:
 *             PaymentSucceeded:
 *               $ref: '#/components/examples/WebhookExamples/PaymentSucceeded'
 *             PaymentDisputed:
 *               $ref: '#/components/examples/WebhookExamples/PaymentDisputed'
 *     responses:
 *       200:
 *         description: Webhook event processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Webhook event processed
 *                   data: {}
 *       400:
 *         description: Invalid event or signature
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 */
router.post('/webhook', paymentController.handleWebhook);

module.exports = router; 