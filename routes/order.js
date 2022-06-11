const router = require("express").Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Order = require("../models/Order");

// Create Order
router.post('/', verifyTokenAndAuthorization, async (req, res, next) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const isDeleted = await Order.findByIdAndDelete(req.params.id);
        if (isDeleted) {
            res.status(200).json("Order has been deleted successfully");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get User Order
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        if (orders) {
            res.status(200).json(orders);
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get Monthly Order Stats
router.get("/order/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;