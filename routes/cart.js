const router = require("express").Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Cart = require("../models/Cart");

// Create Cart
router.post('/', verifyTokenAndAuthorization, async (req, res, next) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Update Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedCart);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const isDeleted = await Cart.findByIdAndDelete(req.params.id);
        if (isDeleted) {
            res.status(200).json("Cart has been deleted successfully");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get User Cart
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (cart) {
            res.status(200).json(cart);
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;