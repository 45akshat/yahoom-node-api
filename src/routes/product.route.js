const express = require('express');
const productController = require('../controller/product.controller.js');

const router = express.Router();

// Route to create a new product
router.post('/create', productController.createProduct);

// Route to update an existing product by ID
router.put('/products/:productId', productController.updateProduct);

// Route to delete a product by ID
router.delete('/products/:productId', productController.deleteProduct);

// Route to get a single product by ID
router.get('/products/:productId', productController.getProductById);

// Route to get all products (optionally using filters in query params)
router.get('/products', productController.getAllProducts);

// Route to get products by title (for searching products)
router.get('/products/title/:title', productController.getProductsByTitle);

module.exports = router;
