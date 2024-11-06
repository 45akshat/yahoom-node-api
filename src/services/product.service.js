const Product = require("../models/product.model");

// Create a new product
const createProduct = async (productData) => {
    try {
        const { title, description, price, discountedPrice, discountPercent, quantity, brand, color, sizes, imageUrls } = productData;

        // Create a new product
        const product = await Product.create({
            title,
            description,
            price,
            discountedPrice,
            discountPercent,
            quantity,
            brand,
            color,
            sizes,
            imageUrls
        });

       //console.log("Created product: ", product);
        return product;
    } catch (error) {
        console.error("Error creating product:", error.message);
        throw error;
    }
};

// Update an existing product by ID
const updateProduct = async (productId, updateData) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            throw new Error(`Product not found with id: ${productId}`);
        }

       //console.log("Updated product: ", updatedProduct);
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};

// Delete a product by ID
const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new Error(`Product not found with id: ${productId}`);
        }

       //console.log("Deleted product: ", deletedProduct);
        return { message: "Product deleted successfully" };
    } catch (error) {
        console.error("Error deleting product:", error.message);
        throw error;
    }
};

// Get a product by ID
const getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error(`Product not found with id: ${productId}`);
        }

        return product;
    } catch (error) {
        console.error("Error retrieving product:", error.message);
        throw error;
    }
};

// Get all products (with optional filtering)
const getAllProducts = async (query) => {
    try {
        const filters = {};

        // Read URL parameters from the query
        const { title, priceMin, priceMax, brand, color, size } = query;

        // Add filters based on URL parameters
        if (title) {
            filters.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        }
        if (priceMin || priceMax) {
            filters.price = {};
            if (priceMin) filters.price.$gte = Number(priceMin);
            if (priceMax) filters.price.$lte = Number(priceMax);
        }
        if (brand) {
            filters.brand = brand;
        }

        // Handle multiple colors
        if (color) {
            const colorArray = color.split(','); // Split colors by comma
            filters.color = { $in: colorArray }; // Use $in to match any of the specified colors
        }

        // Handle multiple sizes case-insensitively
        if (size) {
            const sizeArray = size.split(',').map(s => s.trim().toUpperCase()); // Normalize sizes to lowercase
            filters.sizes = {
                $elemMatch: {
                    $or: sizeArray.map(sizeName => ({
                        name: sizeName, // Assuming size names in DB are stored in lowercase
                        quantity: { $gt: 0 } // Only include sizes with quantity greater than 0
                    }))
                }
            };
        }

        // Query the database with the constructed filters
        const products = await Product.find(filters);

        if (!products.length) {
           //console.log("No products found.");
        }

        return products;
    } catch (error) {
        console.error("Error retrieving products:", error.message);
        throw error;
    }
};


// Get products by title (example of a specific filter)
const getProductsByTitle = async (title) => {
    try {
        const products = await Product.find({ title: { $regex: title, $options: "i" } });  // Case-insensitive search

        if (!products.length) {
            throw new Error(`No products found with title: ${title}`);
        }

        return products;
    } catch (error) {
        console.error("Error retrieving products by title:", error.message);
        throw error;
    }
};


// Reduce the quantity of a specific size in a product
const reduceProductQuantity = async (productId, size, quantity) => {
    try {
        // Find the product and the specific size within it
        const product = await Product.findOneAndUpdate(
            {
                _id: productId,
                "sizes.name": size,
                "sizes.quantity": { $gte: quantity } // Ensure sufficient stock
            },
            {
                $inc: { "sizes.$.quantity": -quantity } // Decrease the specified size quantity
            },
            { new: true } // Return the updated document
        );

        if (!product) {
            throw new Error(`Product with id: ${productId} and size: ${size} not found or insufficient quantity`);
        }

       //console.log("Reduced product quantity:", product);
        return product;
    } catch (error) {
        console.error("Error reducing product quantity:", error.message);
        throw error;
    }
};


module.exports = { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductById, 
    getAllProducts, 
    getProductsByTitle, 
    reduceProductQuantity 
};
