const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const projectController = require("../controllers/projectController");
const { addProject } = require("../controllers/userController");

router.post(
    "/create",
    // authenticate,
    projectController.createProject,
    addProject
);

module.exports = router;
