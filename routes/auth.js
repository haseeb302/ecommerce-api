const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

// Register Route
router.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_CRYPTO_KEY).toString(),
    });

    try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    }
    catch (e) {
        res.status(500).json(e);
    }
})

// Login Route
router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const hashedPassword = CryptoJS.AES.decrypt(req.body.password, process.env.SECRET_CRYPTO_KEY).toString();
            if (hashedPassword !== req.body.password) {
                res.status(401).json("Wrong Password");
            }
            else {
                const access_token = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                    process.env.SECRET_JWT_KEY,
                    { expiresIn: "3d" }
                );
                const { password, ...userInfo } = user._doc;
                res.status(200).json({ ...userInfo, access_token });
            }
        } else {
            res.status(401).json("Wrong Email");
        }
    }
    catch (e) {
        res.status(500).json(e);
    }
})

module.exports = router;