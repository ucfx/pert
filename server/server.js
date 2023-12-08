require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require("./routes/userRouter");

app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        status: "success",
        message: "Server is running",
    });
});

app.use("/users", userRouter);

app.listen(port, () => {
    console.log("Server is running on port 3000");
});
