const { Project, Task } = require("../models/projectModel");
const User = require("../models/userModel");

const validateTitle = (value) => {
    if (value.trim() !== "" && !isNaN(value.trim().charAt(0))) {
        return "Must start with a letter";
    }

    if (value !== "" && !/^[a-zA-Z0-9]*$/.test(value)) {
        return "Title must contain only characters and numbers";
    }

    return true;
};

const createProject = async (req, res, next) => {
    const projectData = req.body;
    projectData.userId = req.user._id;
    if (!projectData.title) {
        return res.status(401).json({
            status: "error",
            message: "Title is required",
        });
    }

    const titleError = validateTitle(projectData.title);
    if (titleError !== true) {
        return res.status(401).json({
            status: "error",
            message: titleError,
        });
    }

    try {
        const project = await Project.create(projectData);
        req.project = project;
        console.log("project created");
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message.includes("duplicate key error")
                ? "This title already exists"
                : "Something went wrong",
        });
    }
};

const getAll = async (req, res) => {
    const { _id } = req.user;

    try {
        const { projects } = await User.findById(
            _id,
            "-password -__v -username -_id"
        )
            .populate("projects", "title createdAt updatedAt")
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

const getOne = async (req, res) => {
    const { projectId } = req.params;
    const { _id } = req.user;

    try {
        const project = await Project.findOne({
            _id: projectId,
            userId: _id,
        })
            .select("-__v -userId")
            .populate("tasks", "-__v -projectId -_id");

        console.log("project", project);
        res.json({
            status: "success",
            message: "Project successfully retrieved",
            project: project,
        });
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: "Project not found",
        });
    }
};

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const { _id } = req.user;
    try {
        // const result = await Project.deleteOne({
        //     _id: id,
        //     userId: _id,
        // });

        const result = await Project.findOneAndDelete({ _id: projectId });

        if (result.deletedCount === 0) {
            return res.status(401).json({
                status: "error",
                message: "Project not found",
            });
        }

        // await User.findByIdAndUpdate(
        //     _id,
        //     { $pull: { projects: projectId } },
        //     { new: true }
        // );
        const { projects } = await User.findById(
            _id,
            "-password -__v -username -_id"
        )
            .populate("projects", "title createdAt updatedAt")
            .select("projects");
        res.json({
            status: "success",
            message: "Project successfully deleted",
            projects,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const projectData = { ...req.body, userId: req.user._id };
    console.log("projectData", projectData);
    if (projectData.title) {
        const titleError = validateTitle(projectData.title);
        if (titleError !== true) {
            return res.status(401).json({
                status: "error",
                message: titleError,
            });
        }
    }
    if (projectData.tasks) {
        await Task.deleteMany({ projectId });
        if (projectData.tasks.length > 0) {
            idsArray = await Task.insertMany(
                projectData.tasks.map((task) => ({
                    ...task,
                    projectId,
                }))
            );
            projectData.tasks = idsArray.map((task) => task._id);
            console.log("projectData inserted", projectData);
        }
    }

    try {
        const project = await Project.findByIdAndUpdate(
            projectId,
            projectData,
            {
                new: true,
            }
        )
            .select("-__v -userId")
            .populate("tasks", "-__v -projectId -_id")
            .exec();
        project.save();
        res.json({
            status: "success",
            message: "Project successfully updated",
            project,
        });
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message.includes("duplicate key error")
                ? "Project with this title already exists"
                : "Something went wrong",
        });
    }
};

module.exports = {
    createProject,
    getAll,
    getOne,
    deleteProject,
    updateProject,
};
