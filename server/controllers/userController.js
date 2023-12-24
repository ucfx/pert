const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: "", password: "", cnfPassword: "" };

    // username length
    if (err.message === "username length") {
        errors.username = "Username must be at least 2 characters";
    }

    // all fields are required
    if (err.message === "all fields are required") {
        errors.username = "Username is required";
        errors.password = "Password is required";
    }

    // password length
    if (err.message === "password length") {
        errors.password = "Password must be at least 6 characters";
    }

    // password not match
    if (err.message === "password not match") {
        errors.cnfPassword = "That password is not match";
    }

    // Incorrect password
    if (err.message === "Incorrect password") {
        errors.password = "That password is incorrect";
    }

    // Validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

class UserController {
    static async create(req, res) {
        try {
            const { username, password, cnfPassword } = req.body;
            if (username === "" || password === "" || cnfPassword === "") {
                throw new Error("all fields are required");
            }

            if (username.length < 2) {
                throw new Error("username length");
            }

            if (password.length < 2) {
                throw new Error("password length");
            }

            if (password !== cnfPassword) {
                throw new Error("password not match");
            }

            const passwordHash = bcrypt.hashSync(password, 10);
            const user = await User.create({
                username,
                password: passwordHash,
            });
            res.status(201).json({
                status: "success",
                message: "User successfully created",
                user,
            });
        } catch (error) {
            const errors = handleErrors(error);
            res.status(400).json({
                status: "error",
                errors,
            });
        }
    }
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (user) {
                const isPasswordValid = bcrypt.compareSync(
                    password,
                    user.password
                );
                if (isPasswordValid) {
                    req.user = { _id: user._id };
                    next();
                } else {
                    res.json({
                        status: "error",
                        message: "Invalid username or password",
                    });
                }
            } else {
                res.json({
                    status: "error",
                    message: "Invalid username or password",
                });
            }
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
    static async getAll(req, res) {
        try {
            const users = await User.find();
            res.json({
                status: "success",
                message: "Users successfully retrieved",
                data: {
                    users,
                },
            });
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }

    static async getOne(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.json({
                status: "success",
                message: "User successfully retrieved",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }

    static async update(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { name, email, password },
                { new: true } // To return the updated document
            );
            res.json({
                status: "success",
                message: "User successfully updated",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }

    static async checkIsAvailable(req, res) {
        console.log(req.params.username);
        try {
            const user = await User.findOne({ username: req.params.username });
            if (user) {
                res.json({
                    success: true,
                    available: false,
                });
            } else {
                res.json({
                    success: true,
                    available: true,
                });
            }
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }

    static async delete(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.json({
                status: "success",
                message: "User successfully deleted",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
}

module.exports = UserController;
