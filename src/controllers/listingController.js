const multer = require('multer');
const path = require('path');
const listingGenerator = require('../services/ai/listingGenerator');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('image');

// Controller methods
const listingController = {
  // Generate listing from image
  async generateListing(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No image file provided' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Analyze image
        const analysis = await listingGenerator.analyzeImage(imageUrl);
        
        // Generate listing description
        const description = await listingGenerator.generateListing(analysis);
        
        // Get price suggestion
        const priceSuggestion = await listingGenerator.suggestPrice(analysis);

        res.json({
          success: true,
          data: {
            imageUrl,
            analysis,
            description,
            priceSuggestion
          }
        });
      });
    } catch (error) {
      console.error('Error in generateListing:', error);
      res.status(500).json({ error: 'Failed to generate listing' });
    }
  },

  // Create a new listing
  async createListing(req, res) {
    try {
      // TODO: Implement listing creation with database
      res.status(201).json({ message: 'Listing created successfully' });
    } catch (error) {
      console.error('Error in createListing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  },

  // Get all listings with search and filtering
  async getListings(req, res) {
    try {
      const {
        keyword,
        category,
        minPrice,
        maxPrice,
        type,
        brand,
        condition,
        size,
        color,
        lat,
        lng,
        radius,
        sortBy,
        sortOrder
      } = req.query;

      const filter = {};

      // Simple search
      if (keyword) {
        filter.$text = { $search: keyword };
      }
      if (category) filter.category = category;
      if (type) filter.listingType = type;
      if (brand) filter.brand = brand;
      if (condition) filter.condition = condition;
      if (size) filter.size = size;
      if (color) filter.color = color;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // Advanced: location-based search
      if (lat && lng && radius) {
        filter.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius, 10)
          }
        };
      }

      // Sorting
      let sort = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sort.createdAt = -1; // Default: newest first
      }

      const listings = await require('../models/Listing').find(filter).sort(sort);
      res.json(listings);
    } catch (error) {
      console.error('Error in getListings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  },

  // Get a single listing
  async getListing(req, res) {
    try {
      // TODO: Implement fetching single listing from database
      res.json({ message: 'Get single listing' });
    } catch (error) {
      console.error('Error in getListing:', error);
      res.status(500).json({ error: 'Failed to fetch listing' });
    }
  },

  // Update a listing
  async updateListing(req, res) {
    try {
      // TODO: Implement listing update with database
      res.json({ message: 'Listing updated successfully' });
    } catch (error) {
      console.error('Error in updateListing:', error);
      res.status(500).json({ error: 'Failed to update listing' });
    }
  },

  // Delete a listing
  async deleteListing(req, res) {
    try {
      // TODO: Implement listing deletion with database
      res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error in deleteListing:', error);
      res.status(500).json({ error: 'Failed to delete listing' });
    }
  }
};

module.exports = listingController; 