const router = require("express").Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Product = require("../models/Product");

// Create Product
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (e) {
        res.status(500).json(e);
    }
})

// // Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Delete Product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const isDeleted = await Product.findByIdAndDelete(req.params.id);
        if (isDeleted) {
            res.status(200).json("Product has been deleted successfully");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get Product
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get All Users
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json("products not found");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;