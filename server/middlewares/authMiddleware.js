const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
async function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        const user = await User.findById(decoded._id);
        if (!user) {
            return res
                .clearCookie("token")
                .status(401)
                .json({ error: "Unauthorized - Invalid token 00" });
        }

        next();
    } catch (error) {
        return res
            .clearCookie("token")
            .status(401)
            .json({ error: "Unauthorized - Invalid token" });
    }
}

function generateToken(req, res) {
    const token = jwt.sign(req.user, process.env.TOKEN_SECRET, {
        expiresIn: "1w",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 604800000 });

    res.json({
        status: "success",
        message: "User successfully logged in",
        user: { _id: req.user._id, username: req.user.username },
    });
}

module.exports = { authenticate, generateToken };
