const User = require("../models/userModel");

class UserController {
    static async getAll(req, res) {
        try {
            const users = await User.getAll();
            res.send({
                status: "success",
                message: "Users successfully retrieved",
                data: {
                    users,
                },
            });
        } catch (error) {
            res.send({
                status: "error",
                message: error.message,
            });
        }
    }

    static async getOne(req, res) {
        try {
            const user = await User.getOne(req.params.id);
            res.send({
                status: "success",
                message: "User successfully retrieved",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.send({
                status: "error",
                message: error.message,
            });
        }
    }

    static async create(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.create(name, email, password);
            res.send({
                status: "success",
                message: "User successfully created",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.send({
                status: "error",
                message: error.message,
            });
        }
    }

    static async update(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.update(
                req.params.id,
                name,
                email,
                password
            );
            res.send({
                status: "success",
                message: "User successfully updated",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.send({
                status: "error",
                message: error.message,
            });
        }
    }

    static async delete(req, res) {
        try {
            const user = await User.delete(req.params.id);
            res.send({
                status: "success",
                message: "User successfully deleted",
                data: {
                    user,
                },
            });
        } catch (error) {
            res.send({
                status: "error",
                message: error.message,
            });
        }
    }
}

module.exports = UserController;
