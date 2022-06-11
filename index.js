const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const authRoutes = require("./routes/auth");


dotenv.config();

mongoose.connect(
    process.env.MONGO_URL
).then(() => {
    console.log("COnnected");
}).catch((e) => console.log(e));

app.listen(process.env.PORT || 5000, () => {
    console.log("It's running");
})

app.use(express.json());

// All routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);