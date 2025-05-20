const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Rental management and requests
 */

/**
 * @swagger
 * /api/rentals/{listingId}/request:
 *   post:
 *     summary: Request a rental
 *     description: Submits a rental request for a listing.
 *     operationId: requestRental
 *     tags: [Rentals]
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
 *             $ref: '#/components/schemas/RentalRequest'
 *           examples:
 *             RequestRental:
 *               $ref: '#/components/examples/RequestExamples/RequestRental'
 *     responses:
 *       200:
 *         description: Rental request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               RentalRequested:
 *                 $ref: '#/components/examples/ResponseExamples/RentalRequested'
 *       400:
 *         description: Invalid input or rental not allowed
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
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:listingId/request', auth, rentalController.requestRental);

/**
 * @swagger
 * /api/rentals/{requestId}/approve:
 *   post:
 *     summary: Approve a rental request
 *     description: Approves a pending rental request.
 *     operationId: approveRental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental request ID
 *     responses:
 *       200:
 *         description: Rental request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Rental request approved
 *                   data: {}
 *       400:
 *         description: Invalid request or rental not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Rental request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:requestId/approve', auth, rentalController.approveRental);

/**
 * @swagger
 * /api/rentals/{requestId}/reject:
 *   post:
 *     summary: Reject a rental request
 *     description: Rejects a pending rental request.
 *     operationId: rejectRental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelRequest'
 *           examples:
 *             CancelRequest:
 *               value:
 *                 reason: 'Renter did not meet requirements.'
 *     responses:
 *       200:
 *         description: Rental request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Rental request rejected
 *                   data: {}
 *       400:
 *         description: Invalid request or rental not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Rental request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:requestId/reject', auth, rentalController.rejectRental);

/**
 * @swagger
 * /api/rentals/{rentalId}/extend:
 *   post:
 *     summary: Request a rental extension
 *     description: Requests an extension for an active rental.
 *     operationId: requestExtension
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rentalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExtensionRequest'
 *           examples:
 *             ExtendRental:
 *               $ref: '#/components/examples/RequestExamples/ExtendRental'
 *     responses:
 *       200:
 *         description: Rental extension requested
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               RentalExtended:
 *                 $ref: '#/components/examples/ResponseExamples/RentalExtended'
 *       400:
 *         description: Invalid request or extension not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:rentalId/extend', auth, rentalController.requestExtension);

/**
 * @swagger
 * /api/rentals/{rentalId}/cancel:
 *   post:
 *     summary: Cancel a rental
 *     description: Cancels an active rental.
 *     operationId: cancelRental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rentalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelRequest'
 *           examples:
 *             CancelRequest:
 *               value:
 *                 reason: 'Renter cancelled due to change of plans.'
 *     responses:
 *       200:
 *         description: Rental cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Rental cancelled
 *                   data: {}
 *       400:
 *         description: Invalid request or cancellation not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:rentalId/cancel', auth, rentalController.cancelRental);

/**
 * @swagger
 * /api/rentals/{rentalId}/status:
 *   get:
 *     summary: Get rental status
 *     description: Retrieves the status of a specific rental.
 *     operationId: getRentalStatus
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rentalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     responses:
 *       200:
 *         description: Rental status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *             examples:
 *               RentalExample:
 *                 $ref: '#/components/examples/RentalExample'
 *       404:
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.get('/:rentalId/status', auth, rentalController.getRentalStatus);

/**
 * @swagger
 * /api/rentals/{listingId}/availability:
 *   post:
 *     summary: Check rental availability and get price
 *     description: Checks if a listing is available for rental and returns the price.
 *     operationId: checkAvailability
 *     tags: [Rentals]
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
 *             $ref: '#/components/schemas/RentalRequest'
 *           examples:
 *             RequestRental:
 *               $ref: '#/components/examples/RequestExamples/RequestRental'
 *     responses:
 *       200:
 *         description: Availability and price information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Available
 *                   data:
 *                     available: true
 *                     price: 5000
 *       400:
 *         description: Invalid input or unavailable
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
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/rentals/{listingId}/bookings:
 *   post:
 *     summary: Create a rental booking
 *     description: Creates a new booking for a rental listing.
 *     operationId: createBooking
 *     tags: [Rentals]
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
 *             $ref: '#/components/schemas/RentalRequest'
 *           examples:
 *             RequestRental:
 *               $ref: '#/components/examples/RequestExamples/RequestRental'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               RentalRequested:
 *                 $ref: '#/components/examples/ResponseExamples/RentalRequested'
 *       400:
 *         description: Invalid input or booking not allowed
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
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/rentals/{listingId}/bookings/{bookingId}/confirm:
 *   post:
 *     summary: Confirm a rental booking
 *     description: Confirms a booking for a rental listing.
 *     operationId: confirmBooking
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Booking confirmed
 *                   data: {}
 *       400:
 *         description: Invalid booking or state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/rentals/{listingId}/bookings/{bookingId}/cancel:
 *   post:
 *     summary: Cancel a rental booking
 *     description: Cancels a booking for a rental listing.
 *     operationId: cancelBooking
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelRequest'
 *           examples:
 *             CancelRequest:
 *               value:
 *                 reason: 'Customer cancelled due to emergency.'
 *     responses:
 *       200:
 *         description: Booking cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Booking cancelled
 *                   data: {}
 *       400:
 *         description: Invalid booking or state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *
 * /api/rentals/{listingId}/bookings/{bookingId}/complete:
 *   post:
 *     summary: Complete a rental
 *     description: Marks a rental as completed.
 *     operationId: completeRental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Rental completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Rental completed
 *                   data: {}
 *       400:
 *         description: Invalid booking or state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               InvalidStateError:
 *                 $ref: '#/components/examples/ErrorExamples/InvalidStateError'
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
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
// All rental routes require authentication
router.use(auth);

// Check availability and get price
router.post('/:listingId/availability', rentalController.checkAvailability);

// Create a booking
router.post('/:listingId/bookings', rentalController.createBooking);

// Confirm a booking
router.post('/:listingId/bookings/:bookingId/confirm', rentalController.confirmBooking);

// Cancel a booking
router.post('/:listingId/bookings/:bookingId/cancel', rentalController.cancelBooking);

// Complete a rental
router.post('/:listingId/bookings/:bookingId/complete', rentalController.completeRental);

module.exports = router; 