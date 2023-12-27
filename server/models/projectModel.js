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
    },
    tasks: [taskSchema],
    createdAt: { type: Date },
    updatedAt: { type: Date },
});

projectSchema.pre("save", function (next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
