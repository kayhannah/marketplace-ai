require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');
const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Stripe webhook must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Custom Swagger UI options for branding
const swaggerUiOptions = {
  customSiteTitle: 'Marketplace AI API Docs',
  customfavIcon: 'https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/32/book.png', // Example favicon
  customCss: '.swagger-ui .topbar { background: #2d3748; } .swagger-ui .topbar-wrapper img { content:url(https://marketplace.canva.com/EAFKQw1Qn1w/1/0/1600w/canva-blue-and-white-minimalist-market-logo-1nQk1Qn1w1w.png); height:40px; }',
};

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Export OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Marketplace AI API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 