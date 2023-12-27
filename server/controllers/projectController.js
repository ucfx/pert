const Project = require("../models/projectModel");
const User = require("../models/userModel");
const createProject = async (req, res, next) => {
    const projectData = req.body;
    try {
        const project = await Project.create(projectData);
        req.project = project;
        console.log("project created");
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message,
        });
    }
};

const getProjects = async (req, res) => {
    const { _id } = req.user;

    try {
        const { projects } = await User.findById(
            _id,
            "-password -__v -username -_id"
        )
            .populate("projects", "title createdAt")
            .select("projects");
        res.json({
            status: "success",
            message: "Projects successfully retrieved",
            projects,
        });
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message,
        });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;
    try {
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({
                status: "error",
                message: "Project not found",
            });
        }

        await User.findByIdAndUpdate(
            _id,
            { $pull: { projects: deletedProject._id } },
            { new: true }
        );
        const { projects } = await User.findById(
            _id,
            "-password -__v -username -_id"
        )
            .populate("projects", "title createdAt")
            .select("projects");
        res.json({
            status: "success",
            message: "Project successfully deleted",
            projects,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const projectData = req.body;
    try {
        const project = await Project.findByIdAndUpdate(id, projectData, {
            new: true,
        });
        project.save();
        res.json({
            status: "success",
            message: "Project successfully updated",
            project,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    deleteProject,
    updateProject,
};
