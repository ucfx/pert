const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    key: {
        type: Number,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    dependsOn: [
        {
            type: Number,
        },
    ],
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    tasks: [taskSchema],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
