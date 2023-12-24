const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const token = req.cookie.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .clearCookie("token")
            .redirect("/login")
            .status(401)
            .json({ error: "Unauthorized - Invalid token" });
    }
}

function generateToken(req, res) {
    const token = jwt.sign(
        {
            _id: req.user._id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1w" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.json({
        status: "success",
        message: "User successfully logged in",
        user: { _id: req.user._id },
    });
}

module.exports = { authenticate, generateToken };
