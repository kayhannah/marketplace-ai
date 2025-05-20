const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications and preferences
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unread
 *         schema:
 *           type: boolean
 *         description: Filter for unread notifications
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of notifications
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplexResponse'
 *             examples:
 *               ListResponse:
 *                 $ref: '#/components/examples/ResponseExamples/ListingCreated'
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
router.get('/', auth, notificationController.getNotifications);

/**
 * @swagger
 * /api/notifications/unread/count:
 *   get:
 *     summary: Get count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   count: 5
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
router.get('/unread/count', auth, notificationController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Notification marked as read
 *                   data: null
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
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/read/all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: All notifications marked as read
 *                   data:
 *                     count: 10
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
router.patch('/read/all', auth, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Notification deleted
 *                   data: null
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
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.delete('/:notificationId', auth, notificationController.deleteNotification);

/**
 * @swagger
 * /api/notifications/preferences:
 *   get:
 *     summary: Get user notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: boolean
 *                 push:
 *                   type: boolean
 *                 sms:
 *                   type: boolean
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   email: true
 *                   push: false
 *                   sms: true
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
router.get('/preferences', auth, notificationController.getPreferences);

/**
 * @swagger
 * /api/notifications/preferences:
 *   patch:
 *     summary: Update user notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *               sms:
 *                 type: boolean
 *           examples:
 *             UpdatePreferences:
 *               value:
 *                 email: true
 *                 push: true
 *                 sms: false
 *     responses:
 *       200:
 *         description: Notification preferences updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Preferences updated
 *                   data:
 *                     email: true
 *                     push: true
 *                     sms: false
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
router.patch('/preferences', auth, notificationController.updatePreferences);

module.exports = router; 