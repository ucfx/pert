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

const create = async (req, res) => {
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
};
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                req.user = { _id: user._id, username: user.username };
                next();
            } else {
                res.status(401).json({
                    status: "error",
                    message: "Invalid username or password",
                });
            }
        } else {
            res.status(401).json({
                status: "error",
                message: "Invalid username or password",
            });
        }
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token").json({
            status: "success",
            message: "User successfully logged out",
        });
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message,
        });
    }
};

const getAll = async (req, res) => {
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
};

const addProject = async (req, res) => {
    const { _id } = req.user;
    // const _id = "65898df935d9414b660740cd";
    const { _id: projectId } = req.project;
    try {
        const { projects } = await User.findByIdAndUpdate(
            _id,

            { $push: { projects: projectId } },
            { new: true }
        )
            .select("-password -__v -username -_id")
            .populate("projects", "title createdAt updatedAt");
        res.json({
            status: "success",
            message: "Project successfully added to user",
            projects,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(
            req.user._id,
            "-password -__v -projects"
        );
        res.json({
            status: "success",
            message: "User successfully retrieved",
            user,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: error.message,
        });
    }
};

const update = async (req, res) => {
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
};

const checkIsAvailable = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
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
};

module.exports = {
    create,
    login,
    getAll,
    addProject,
    getUserInfo,
    update,
    checkIsAvailable,
    logout,
    deleteUser,
};
