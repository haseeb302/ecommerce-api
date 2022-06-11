const router = require("express").Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const User = require("../models/User");

// Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_CRYPTO_KEY).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json(e);
    }
})

// Delete User
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const isDeleted = await User.findByIdAndDelete(req.params.id);
        if (isDeleted) {
            res.status(200).json("User has been deleted successfully");
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get User
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const { password, ...other } = user._doc;
            res.status(200).json(other);
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get All Users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ id: -1 }).limit(5)
            : await User.find();
        if (users.length > 0) {
            res.status(200).json(users);
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

// Get All Users Stats
router.get("/user/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;