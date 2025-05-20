const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Listing management and search
 */

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Get all listings with filtering, search, and pagination
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [sale, auction, rental]
 *         description: Filter by listing type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword search
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, createdAt, relevance]
 *         description: Sort by field
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
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComplexResponse'
 *             examples:
 *               SearchResults:
 *                 $ref: '#/components/examples/ComplexScenarios/SearchResults'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               ValidationError:
 *                 $ref: '#/components/examples/ErrorExamples/ValidationError'
 *
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *           examples:
 *             CreateListing:
 *               $ref: '#/components/examples/RequestExamples/CreateListing'
 *     responses:
 *       201:
 *         description: Listing created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingCreated:
 *                 $ref: '#/components/examples/ResponseExamples/ListingCreated'
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
router.get('/', listingController.getListings);
router.post('/', auth, upload.array('images', 5), listingController.createListing);

/**
 * @swagger
 * /api/listings/{listingId}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingExample:
 *                 $ref: '#/components/examples/ListingExample'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *   patch:
 *     summary: Update listing
 *     tags: [Listings]
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
 *             $ref: '#/components/schemas/Listing'
 *           examples:
 *             UpdateListing:
 *               $ref: '#/components/examples/RequestExamples/UpdateListing'
 *     responses:
 *       200:
 *         description: Listing updated successfully
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
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 *   delete:
 *     summary: Delete listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               SuccessResponse:
 *                 value:
 *                   message: Listing deleted successfully
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
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.get('/:listingId', listingController.getListing);
router.patch('/:listingId', auth, listingController.updateListing);
router.delete('/:listingId', auth, listingController.deleteListing);

/**
 * @swagger
 * /api/listings/{listingId}/images:
 *   post:
 *     summary: Add images to listing
 *     tags: [Listings]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingExample:
 *                 $ref: '#/components/examples/ListingExample'
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
 *   delete:
 *     summary: Delete listing image
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *       - in: query
 *         name: imageUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: URL of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               ListingExample:
 *                 $ref: '#/components/examples/ListingExample'
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
 *         description: Listing or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/examples/ErrorExamples/NotFoundError'
 */
router.post('/:listingId/images', auth, upload.array('images', 5), listingController.addImages);
router.delete('/:listingId/images', auth, listingController.deleteImage);

module.exports = router; 