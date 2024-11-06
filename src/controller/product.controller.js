const productService = require("../services/product.service.js");

// Create a new product
const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Call the service to create a product
        const product = await productService.createProduct(productData);

        // Send response with created product
        return res.status(201).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Update an existing product by ID
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        // Call the service to update the product
        const updatedProduct = await productService.updateProduct(productId, updateData);

        // Send response with updated product
        return res.status(200).send(updatedProduct);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Call the service to delete the product
        const result = await productService.deleteProduct(productId);

        // Send response with success message
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Call the service to get the product by ID
        const product = await productService.getProductById(productId);

        // Send response with product data
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get all products (optionally with filters)
const getAllProducts = async (req, res) => {
    try {
        const filters = req.query;  // Optional filters via query params

        // Call the service to get all products
        const products = await productService.getAllProducts(filters);

        // Send response with products data
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get products by title (example of specific filter)
const getProductsByTitle = async (req, res) => {
    try {
        const { title } = req.params;

        // Call the service to get products by title
        const products = await productService.getProductsByTitle(title);

        // Send response with products data
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
    getProductsByTitle
};
