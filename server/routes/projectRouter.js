const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const projectController = require("../controllers/projectController");
const { addProject } = require("../controllers/userController");

router.post("/", authenticate, projectController.createProject, addProject);
router.get("/", authenticate, projectController.getAll);
router.delete("/:id", authenticate, projectController.deleteProject);
router.get("/:projectId", authenticate, projectController.getOne);
router.put("/:projectId", projectController.updateProject);
module.exports = router;
