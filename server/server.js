require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { authenticate } = require("./middlewares/authMiddleware");
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pert";
(async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");

        app.use(express.json());
        app.use(cookieParser());

        const userRouter = require("./routes/userRouter");
        app.use("/users", userRouter);
        app.get("/auth", authenticate, (req, res) => {
            res.json({ status: "success", user: { _id: req.user._id } });
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error.message);
    }
})();
