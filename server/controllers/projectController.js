const Project = require("../models/projectModel");

const createProject = async (req, res, next) => {
    const projectData = req.body || { title: "project title" };
    try {
        const project = await Project.create(projectData);
        req.project = project;
        console.log("project created");
        next();
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = {
    createProject,
};
